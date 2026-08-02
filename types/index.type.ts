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
  slug: string;
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

export type DemoCredentialType = {
  role: string;
  email: string;
  password: string;
};

export type WorkType = {
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

export type TimelineType = {
  id: string;
  year: string;
  title: string;
  description?: string | null;
};
