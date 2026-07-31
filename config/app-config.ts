import { getBaseUrl } from "@/lib/base-url";

export const APP_CONFIG = {
  BASE_URL: getBaseUrl(),

  ROUTE: {
    ADMIN: "admin",
    HOME: "/",
    ABOUT: "about",
    PROJECTS: "projects",
    POSTS: "posts",
    CERTIFICATES: "certificates",
    CONTACT: "contact",
    SETTINGS: "settings",
    TIMELINES: "timelines",
    MILESTONES: "milestones",
  },
};
