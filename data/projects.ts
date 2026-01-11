import Wda from "@/public/project-images/wda.png";
import Academic from "@/public/project-images/academic-center.png";
import NarutoVerse from "@/public/project-images/narutoverse.png";
import Sms from "@/public/project-images/student_management_system.png";

export const projects = [
  // Last 2 projects are featured projects
  {
    image: Wda,
    title: "Win Dental Academy",
    description:
      "Win Dental Academy is a cutting-edge digital learning management system specifically designed for dental education and professional development. This comprehensive platform serves as a centralized hub for dental institutions and professionals, offering an intuitive course catalog system and dynamic news updates. The platform features admin panel with full CRUD operations, enabling seamless content management and user administration. Built with modern web technologies, it provides an exceptional user experience with responsive design, secure authentication, and scalable architecture to support growing educational institutions in the dental field.",
    objectives: [
      "Architected scalable course management system with Next.js and Prisma",
      "Implemented role-based access control for admin with RestFul APIs for data implementation",
      "Designed responsive UI components with Tailwind CSS and Shadcn/ui",
    ],
    challenges: [
      "Scalable photo uploading for news according to client's satisfaction",
    ],
    category: "Web Development",
    techStacks: [
      "Next.js",
      "Javascript",
      "TailwindCSS",
      "Shadcn",
      "Prisma",
      "MySQL",
    ],
    isGitHub: false,
    isLiveDemo: true,
    upcoming: false,
    expectedCompletion: "",
    github: "",
    liveDemo: "https://windentalacademy.com/",
  },
  {
    image: Sms,
    title: "Student Management System",
    description:
      "An educational management platform with secure authentication, comprehensive database relations between each roles, real-time student tracking, grade analytics, and administrative dashboard for institutional operations.",

    objectives: [
      "Built type-safe application with Next.js and TypeScript",
      "Integrated Clerk authentication with role-based permissions",
      "Developed real-time analytics dashboard with interactive charts with Re-chart",
    ],

    challenges: [
      "Complex data relationships between students, courses, and grades",
      "Real-time synchronization across multiple user sessions",
      "Comprehensive role-based data access within admin, teacher, student and parent",
    ],
    category: "Web Development",
    techStacks: ["Next.js", "Typescript", "Shadcn", "Clerk", "Prisma", "MySQL"],
    isGitHub: true,
    isLiveDemo: false,
    upcoming: false,
    expectedCompletion: "",
    github: "https://github.com/Thureinhtet99/Student-Mangement-System",
    liveDemo: "",
  },
  {
    image: Academic,
    title: "Academic Center",
    description:
      "A modern e-learning ecosystem built with React and Laravel, featuring progressive course structures, interactive assignments.",
    objectives: [
      "Developed responsive frontend with React and modern UI patterns",
      "Built RESTful API backend with Laravel for course management",
      "Implemented file upload system for assignments and resources",
    ],

    challenges: [
      "Cross-browser compatibility for diverse user devices",
      "Efficient file handling for large assignment uploads",
      "Seamless integration between React frontend and Laravel backend",
    ],
    category: "Web Development",
    techStacks: ["React", "Laravel"],
    isGitHub: true,
    isLiveDemo: false,
    upcoming: false,
    expectedCompletion: "",
    github: "https://github.com/Thureinhtet99/Academic-Center",
    liveDemo: "",
  },
  {
    image: NarutoVerse,
    title: "Narutoverse",
    description:
      "An immersive anime fan portal showcasing detailed character encyclopedias, story timeline visualizations, and interactive naruto anime world exploration with stunning visual design.",

    objectives: [
      "Created immersive UI with custom animations and transitions",
      "Implemented efficient data fetching with Next.js API routes",
      "Designed responsive character cards with detailed information architecture",
    ],

    challenges: [
      "Organizing vast character database with searchable interface",
      "Creating smooth animations without performance impact",
      "Responsive design for complex visual layouts",
    ],
    category: "FreeStyle",
    techStacks: ["Next.js", "Tailwind", "Shadcn"],
    isGitHub: false,
    isLiveDemo: true,
    upcoming: false,
    expectedCompletion: "",
    github: "https://github.com/Thureinhtet99/narutoverse",
    liveDemo: "https://narutoverse-kappa.vercel.app/",
  },

  {
    image: "",
    title: "Expense Tracker Mobile App",
    description:
      "A cross-platform mobile application for personal finance management, featuring intelligent expense categorization, visual spending analytics, and offline-capable SQLite data persistence.",

    objectives: [
      "Building cross-platform app with React Native and TypeScript",
      "Implementing offline-first architecture with SQLite storage",
      "Creating intuitive expense input with AI-powered categorization",
    ],

    challenges: [
      "Offline data synchronization when connectivity returns",
      "Intuitive expense categorization with machine learning",
      "Performance optimization for large transaction datasets",
    ],
    category: "Mobile Development",
    techStacks: ["React Native", "TypeScript", "Gluestack", "SQLite"],
    isGitHub: true,
    isLiveDemo: false,
    upcoming: true,
    expectedCompletion: "",
    github: "https://github.com/Thureinhtet99/expense-tracker",
    liveDemo: "",
  },

  // Add more projects here...
];
