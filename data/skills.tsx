import {
  FaReact,
  FaNodeJs,
  FaJsSquare,
  FaGitAlt,
  FaHtml5,
  FaCss3Alt,
  FaBootstrap,
  FaWindows,
  FaGithub,
} from "react-icons/fa";
import {
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiMongodb,
  SiExpress,
  SiPrisma,
  SiNpm,
  SiPnpm,
  SiUbuntu,
  SiPostman,
  SiMysql,
  SiReacthookform,
  SiZod,
  SiShadcnui,
  SiExpo,
  SiVite,
  SiReactquery,
  SiPostgresql,
  SiSqlite,
} from "react-icons/si";

export const skills = [
  // Frontend Technologies
  {
    name: "HTML5",
    icon: <FaHtml5 className="text-orange-600" />,
  },
  {
    name: "CSS3",
    icon: <FaCss3Alt className="text-blue-600" />,
  },
  {
    name: "JavaScript",
    icon: <FaJsSquare className="text-yellow-400" />,
  },
  {
    name: "TypeScript",
    icon: <SiTypescript className="text-blue-600" />,
  },
  {
    name: "React",
    icon: <FaReact className="text-cyan-400" />,
  },
  {
    name: "React Native",
    icon: <FaReact className="text-cyan-500" />,
  },
  {
    name: "Next.js",
    icon: <SiNextdotjs className="text-black dark:text-white" />,
  },
  {
    name: "Expo",
    icon: <SiExpo className="text-gray-800 dark:text-white" />,
  },
  {
    name: "Vite",
    icon: <SiVite className="text-purple-500" />,
  },
  {
    name: "Tailwind CSS",
    icon: <SiTailwindcss className="text-cyan-400" />,
  },
  {
    name: "Shadcn/ui",
    icon: <SiShadcnui className="text-black dark:text-white" />,
  },
  {
    name: "Bootstrap",
    icon: <FaBootstrap className="text-purple-600" />,
  },

  // Form & State Management
  {
    name: "React Hook Form",
    icon: <SiReacthookform className="text-pink-500" />,
  },
  {
    name: "Zod",
    icon: <SiZod className="text-blue-700" />,
  },
  {
    name: "React Query",
    icon: <SiReactquery className="text-red-500" />,
  },
  {
    name: "TanStack Query",
    icon: <SiReactquery className="text-red-500" />,
  },

  // Backend Technologies
  {
    name: "Node.js",
    icon: <FaNodeJs className="text-green-500" />,
  },
  {
    name: "Express.js",
    icon: <SiExpress className="text-gray-600 dark:text-gray-300" />,
  },

  // Databases
  {
    name: "MongoDB",
    icon: <SiMongodb className="text-green-500" />,
  },
  {
    name: "PostgreSQL",
    icon: <SiPostgresql className="text-blue-700" />,
  },
  {
    name: "SQLite",
    icon: <SiSqlite className="text-blue-400" />,
  },
  {
    name: "MySQL",
    icon: <SiMysql className="text-blue-600" />,
  },
  {
    name: "Prisma",
    icon: <SiPrisma className="text-gray-800 dark:text-white" />,
  },

  // Tools & DevOps
  {
    name: "NPM",
    icon: <SiNpm className="text-red-600" />,
  },
  {
    name: "PNPM",
    icon: <SiPnpm className="text-orange-400" />,
  },
  {
    name: "Git",
    icon: <FaGitAlt className="text-red-500" />,
  },
  {
    name: "GitHub",
    icon: <FaGithub className="text-gray-800 dark:text-white" />,
  },
  {
    name: "Postman",
    icon: <SiPostman className="text-orange-500" />,
  },

  // Operating Systems
  {
    name: "Ubuntu",
    icon: <SiUbuntu className="text-orange-500" />,
  },
  {
    name: "Windows",
    icon: <FaWindows className="text-blue-500" />,
  },
];
