import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
process.env.VERCEL = "1";

async function test() {
  const { getProjects } =
    await import("../features/projects/services/project.service");
  const { getWorkExperiences } =
    await import("../features/timeline/services/work-experience.service");
  const { getPublishedPosts } =
    await import("../features/posts/services/post.service");
  const { getTimelines } =
    await import("../features/timeline/services/timeline.service");
  const { getSettings } =
    await import("../features/admin/services/settings.service");

  console.log("--- Settings ---");
  try {
    const s = await getSettings();
    console.log("OK, keys:", Object.keys(s).length);
  } catch (e) {
    console.error("FAIL:", e);
  }

  console.log("--- Projects ---");
  try {
    const p = await getProjects();
    console.log("OK, count:", p.length);
  } catch (e) {
    console.error("FAIL:", e);
  }

  console.log("--- Posts ---");
  try {
    const p = await getPublishedPosts();
    console.log("OK, count:", p.length);
  } catch (e) {
    console.error("FAIL:", e);
  }

  console.log("--- Timelines ---");
  try {
    const t = await getTimelines();
    console.log("OK, count:", t.length);
  } catch (e) {
    console.error("FAIL:", e);
  }

  console.log("--- Work Experiences ---");
  try {
    const w = await getWorkExperiences();
    console.log("OK, count:", w.length);
  } catch (e) {
    console.error("FAIL:", e);
  }
}
test();
