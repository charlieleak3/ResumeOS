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
  type?: 'header' | 'experience' | 'freelance_umbrella' | 'skills' | 'education';
  title: string;
  subtitle?: string;
  content: string;
  tags: string[];
  isFreelanceGroup?: boolean;
}

export interface ResumeSnapshot {
  snapshotId: string;
  profileId: string;
  targetJobTitle: string;
  targetCompany: string;
  blocks: ResumeBlock[];
  createdAt: string;
}

export interface MasterRepository {
  profileId: string;
  fullTimeRoles: ResumeBlock[];
  freelanceHub: ResumeBlock[];
  skillsDatabank: string[];
}
