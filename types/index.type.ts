import { StaticImageData } from "next/image";
import { Dispatch, ReactNode, SetStateAction } from "react";

export type SocialLinkType = {
  href: string;
  label: "GitHub" | "Facebook" | "LinkedIn";
};

// Database Schema Types
export type UserType = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SessionType = {
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;
};

export type AccountType = {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  accessTokenExpiresAt: Date | null;
  refreshTokenExpiresAt: Date | null;
  scope: string | null;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type VerificationType = {
  id: string;
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type DemoCredentialType = {
  role: string;
  email: string;
  password: string;
};

export type ProjectType = {
  id: string;
  title: string;
  description?: string;
  summary?: string;
  startDate?: string;
  technologies?: string[];
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
  objectives?: string[];
  collaborators?: string[];
  demoCredentials?: DemoCredentialType[];
  featured?: boolean;
  stargazersCount?: number;
};

export type ProjectFormState = {
  title: string;
  description: string;
  summary: string;
  startDate: string;
  technologies: string;
  githubUrl: string;
  liveUrl: string;
  objectives: string;
  collaborators: string;
  image: string;
  demoUserEmail: string;
  demoUserPassword: string;
  demoAdminEmail: string;
  demoAdminPassword: string;
  featured: boolean;
};

export type CertificateType = {
  id: string;
  title: string;
  issuer?: string;
  issueDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  image?: string;
};

export type WorkType = {
  id: string;
  type: "work";
  companyName: string;
  companyLogo?: string;
  companyWebsite?: string;
  positions: {
    id: string;
    title: string;
    employmentPeriod: { start: string; end?: string };
    employmentType?: string;
    description?: string;
    skills?: string[];
    isExpanded?: boolean;
  }[];
};

export type EducationType = {
  id: string;
  type: "education";
  institution: string;
  location?: string;
  period: string;
};

export type SettingType = {
  id: string;
  key: string;
  value: string;
  updatedAt: Date;
};

export type PostType = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  body: string;
  tags?: string[];
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type TimelineType = WorkType | EducationType;

// Display Types for Components
export type WorkDisplayType = {
  id: string;
  companyName: string;
  companyLogo?: string;
  companyWebsite?: string;
  positions: {
    id: string;
    title: string;
    employmentPeriod: { start: string; end?: string };
    employmentType?: string;
    description?: string;
    skills?: string[];
    isExpanded?: boolean;
  }[];
};

export type EducationDisplayType = {
  id: string;
  institution: string;
  location?: string;
  period?: string;
};

// Component Props Types
export type ProjectDetailModalType = {
  project: {
    image?: string | StaticImageData;
    title: string;
    summary: string;
    description: string;
    objectives?: string[];
    collaborators?: string[];
    techStacks: string[];
    isGitHub: boolean;
    isLiveDemo: boolean;
    github: string;
    liveDemo: string;
    demoCredentials?: DemoCredentialType[];
  };
  children: ReactNode;
};

export type DeleteConfirmBoxType = {
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  handleDelete: () => void;
  title?: string;
  description?: string;
};

export type FooterType = {
  githubURL: string | "";
  facebookURL: string | "";
  linkedInURL: string | "";
};
