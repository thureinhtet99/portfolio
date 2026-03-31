import { getBaseUrl } from "@/lib/base-url";

export const APP_CONFIG = {
  BASE_URL: getBaseUrl(),

  ROUTE: {
    ADMIN: "admin",
    HOME: "/",
    PROJECTS: "projects",
    TIMELINE: "timeline",
    CERTIFICATES: "certificates",
    CONTACT: "contact",
    SETTINGS: "settings",
    TIMELINES: "timelines",
  },
};
