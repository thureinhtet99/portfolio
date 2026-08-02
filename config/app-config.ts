import { getBaseUrl } from "@/lib/base-url";

export const APP_CONFIG = {
  BASE_URL: getBaseUrl(),

  ROUTE: {
    ADMIN: "admin",
    HOME: "/",
    ABOUT: "about",
    PROJECTS: "projects",
    POSTS: "posts",
    CONTACT: "contact",
    SETTINGS: "settings",
    TIMELINES: "timelines",
    WORK_EXPERIENCES: "work-experiences",
    LABS: "labs",
  },
};
