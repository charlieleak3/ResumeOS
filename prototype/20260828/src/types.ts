export type ThemePreference = 'default' | 'navy' | 'teal' | 'midnight' | 'monochrome';

export interface UserProfile {
  id: string;
  name: string;
  themePreference: ThemePreference;
}

export interface ResumeBlock {
  id: string;
  title: string;
  content: string;
  tags: string[];
}
