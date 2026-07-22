import type { ExperienceItemType } from "@/components/work-experience";

export const experiences: ExperienceItemType[] = [
  {
    id: "1",
    companyName: "Win Dental Academy",
    companyLogo: "",
    companyWebsite: "https://www.windentalacademy.com",
    positions: [
      {
        id: "1",
        title: "Freelance Developer",
        employmentPeriod: {
          start: "08.2024",
          end: "08.2025",
        },
        employmentType: "Remote",
        // icon: "https://example.com/win-dental-academy-logo.png",
        description:
          "Contributed to building and maintaining online learning platform for Win Dental Academy. Integrated features like course management, blogs, and user dashboards.\n\n- Built and deployed productive applications remotely\n- Led development of web applications\n- Tested and debugged across devices, ensuring full mobile responsiveness and cross-browser compatibility.",
        skills: ["Next.js", "JavaScript", "Prisma", "Postgres", "Aiven"],
        isExpanded: true,
      },
    ],
    isCurrentEmployer: false,
  },
  {
    id: "2",
    companyName: "Test",
    companyLogo: "https://example.com/logo.png",
    companyWebsite: "https://example.com",
    positions: [
      {
        id: "1",
        title: "Web Developer",
        employmentPeriod: {
          start: "2023",
          end: "2024",
        },
        employmentType: "Intern",
        // icon: "https://example.com/win-dental-academy-logo.png",
        description:
          "Assisted in developing and maintaining web application features under the guidance of senior developers. Gained hands-on experience in JavaScript, React, and version control using Git.\n\n- Built reusable React components, helping reduce code duplication\n- Learned and applied React Hooks, state management, and REST API integration\n- Contributed to weekly meetings and planning for individual project",
        skills: [
          "React",
          "Vue.js",
          "JavaScript",
          "Bootstrap",
          "REST APIs",
          "ESLint",
        ],
        isExpanded: true,
      },
    ],
    isCurrentEmployer: false,
  },
];
