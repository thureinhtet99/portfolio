export const APP_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",

  AUTH: {
    LOGIN: "login",
    REGISTER: "register",
  },

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
