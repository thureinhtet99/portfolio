import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const formatDate = (dateString: string) => {
//   const date = new Date(dateString);
//   return date.toLocaleDateString("en-US", {
//     month: "short",
//     year: "numeric",
//   });
// };

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** `https://github.com/octocat/` -> `octocat`; empty when there is no URL. */
export const getGithubUsername = (githubUrl?: string | null) =>
  githubUrl?.replace(/\/+$/, "").split("/").pop() || "";

export const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};
