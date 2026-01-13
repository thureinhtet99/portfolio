import { StaticImageData } from "next/image";
import { Dispatch, ReactNode, SetStateAction } from "react";

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

export type ProjectType = {
  id: string;
  title: string;
  description?: string;
  technologies?: string[];
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
  objectives?: string[];
  keyChallenges?: string[];
  featured?: boolean;
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
  title: string;
  company: string;
  location?: string;
  period?: string;
  role?: string;
  description?: string;
  achievements?: string[];
  technologies?: string[];
};

export type EducationType = {
  id: string;
  type: "education";
  degree?: string;
  institution: string;
  location?: string;
  period: string;
  description?: string;
};

export type SettingType = {
  id: string;
  key: string;
  value: string;
  updatedAt: Date;
};

export type TimelineType = WorkType | EducationType;

// Display Types for Components
export type WorkDisplayType = {
  id: string;
  title: string;
  company: string;
  location?: string;
  period?: string;
  type: string;
  description?: string;
  achievements: string[];
  technologies: string[];
};

export type EducationDisplayType = {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  period?: string;
  description?: string;
  achievements: string[];
};

// Component Props Types
export type ProjectDetailModalType = {
  project: {
    image?: string | StaticImageData;
    title: string;
    description: string;
    objectives?: string[];
    challenges?: string[];
    techStacks: string[];
    isGitHub: boolean;
    isLiveDemo: boolean;
    github: string;
    liveDemo: string;
  };
  children: ReactNode;
};

export type DeleteConfirmBoxType = {
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  handleDelete: () => void;
};
