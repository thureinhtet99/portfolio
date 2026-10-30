import { getSettings } from "@/features/admin/services/settings.service";
import { getPublishedPosts } from "@/features/posts/services/post.service";
import { getProjects } from "@/features/projects/services/project.service";
import { getTimelines } from "@/features/timeline/services/timeline.service";
import { getWorkExperiences } from "@/features/timeline/services/work-experience.service";
import type { WorkType } from "@/types/index.type";

/**
 * The assistant only ever sees what is built here. Every field is allow-listed
 * on purpose: never pass raw rows. Project rows contain `demoCredentials`,
 * posts can be unpublished drafts, and settings hold counters and admin data.
 */
export type ContextDoc = {
  id: string;
  title: string;
  url: string;
  text: string;
};

const parseList = (value: string | null | undefined): string[] => {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
};

const lines = (parts: (string | number | null | undefined | false)[]) =>
  parts.filter(Boolean).join("\n");

export async function buildContextDocs(): Promise<ContextDoc[]> {
  const [settings, projects, experiences, timelines, posts] = await Promise.all(
    [
      getSettings(),
      getProjects(),
      getWorkExperiences(),
      getTimelines(),
      getPublishedPosts(),
    ],
  );

  const docs: ContextDoc[] = [];

  docs.push({
    id: "profile",
    title: "Profile and contact",
    url: "/about",
    text: lines([
      settings.intro && `Intro: ${settings.intro}`,
      settings.aboutMe && `About: ${settings.aboutMe}`,
      settings.residence && `Based in: ${settings.residence}`,
      `Currently available for work: ${settings.available === "true" ? "yes" : "no"}`,
      settings.bookingUrl && `Booking link: ${settings.bookingUrl}`,
      settings.emailUrl && `Email link: ${settings.emailUrl}`,
      settings.githubUrl && `GitHub: ${settings.githubUrl}`,
      settings.linkedinUrl && `LinkedIn: ${settings.linkedinUrl}`,
      settings.facebookUrl && `Facebook: ${settings.facebookUrl}`,
      "Contact form: /contact",
    ]),
  });

  docs.push({
    id: "experience",
    title: "Work experience",
    url: "/",
    text:
      experiences
        .map((experience) => {
          const positions = experience.positions as WorkType["positions"];
          return lines([
            `Company: ${experience.companyName}`,
            experience.companyWebsite &&
              `Website: ${experience.companyWebsite}`,
            ...positions.map((position) =>
              lines([
                `- ${position.title}${position.employmentType ? ` (${position.employmentType})` : ""}, ${position.employmentPeriod.start} to ${position.employmentPeriod.end ?? "present"}`,
                position.skills?.length &&
                  `  Skills: ${position.skills.join(", ")}`,
                position.description && `  ${position.description}`,
              ]),
            ),
          ]);
        })
        .join("\n\n") || "No work experience has been added yet.",
  });

  docs.push({
    id: "timeline",
    title: "Career timeline",
    url: "/timeline",
    text:
      timelines
        .map((entry) =>
          lines([
            `${entry.year}: ${entry.title}`,
            entry.description && `  ${entry.description}`,
          ]),
        )
        .join("\n") || "No timeline entries have been added yet.",
  });

  [...projects]
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .forEach((project) => {
      docs.push({
        id: `project:${project.slug}`,
        title: `Project: ${project.title}`,
        url: `/projects/${project.slug}`,
        text: lines([
          `Title: ${project.title}`,
          project.summary && `Summary: ${project.summary}`,
          project.startDate && `Started: ${project.startDate}`,
          project.technologies?.length &&
            `Technologies: ${project.technologies.join(", ")}`,
          project.objectives?.length &&
            `Objectives: ${project.objectives.join("; ")}`,
          project.liveUrl && `Live: ${project.liveUrl}`,
          project.githubUrl && `Source: ${project.githubUrl}`,
          project.description && `\n${project.description}`,
        ]),
      });
    });

  [...posts]
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .forEach((post) => {
      docs.push({
        id: `post:${post.slug}`,
        title: `Blog post: ${post.title}`,
        url: `/posts/${post.slug}`,
        text: lines([
          `Title: ${post.title}`,
          post.excerpt && `Excerpt: ${post.excerpt}`,
          parseList(post.tags).length > 0 &&
            `Tags: ${parseList(post.tags).join(", ")}`,
          `\n${post.body}`,
        ]),
      });
    });

  return docs;
}

/** Map a pathname to the document the visitor is looking at, if any. */
export function findPageDoc(
  docs: ContextDoc[],
  page: string | undefined,
): ContextDoc | null {
  if (!page) return null;
  const path = page.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  return docs.find((doc) => doc.url === path && path !== "/") ?? null;
}
