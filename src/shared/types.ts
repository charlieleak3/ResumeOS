export type ThemePreference = 'default' | 'navy' | 'teal' | 'midnight' | 'monochrome';

export interface UserProfile {
  id: string;
  name: string;
  pinHash?: string;
  themePreference: ThemePreference;
  createdAt: string;
}

export interface ResumeBlock {
  id: string;
  type: 'header' | 'experience' | 'freelance_umbrella' | 'skills' | 'education';
  title: string;
  subtitle?: string;
  content: string; // Rich text HTML / Markdown block
  tags: string[];  // e.g., ['#python', '#leadership']
  isFreelanceGroup?: boolean;
  children?: ResumeBlock[]; // For grouped freelance micro-gigs
}

export interface ResumeSnapshot {
  snapshotId: string;
  profileId: string;
  targetJobTitle: string;
  targetCompany: string;
  jobDescriptionText: string;
  blocks: ResumeBlock[];
  createdAt: string;
}

export interface MasterRepository {
  profileId: string;
  fullTimeRoles: ResumeBlock[];
  freelanceHub: ResumeBlock[];
  skillsDatabank: string[];
}