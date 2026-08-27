export type ThemePreference = 'default' | 'navy' | 'teal' | 'midnight' | 'monochrome';
export type TitleFormatting = 'bold' | 'uppercase' | 'bold-uppercase' | 'normal';
export type SortOrder = 'manual' | 'chronological-desc' | 'chronological-asc';

export interface DatePeriod {
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  isCurrent: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  themePreference: ThemePreference;
}

export interface ContainerEntry {
  id: string;
  title: string;       // Degree / Certificate / Role Title
  subtitle?: string;    // Institution / Company / Organization
  datePeriod?: DatePeriod; // Structured Month/Year dates
  dateRange?: string;   // Formatted display string (e.g., "Jan 2023 – Present")
  selected: boolean;    // Inclusion toggle for targeted builds
  content: string;      // Coursework, bullets, or achievements
}

export interface ResumeBlock {
  id: string;
  title: string;
  sectionKey: string;   // Grouping Key Identifier (e.g. #education, #work_history)
  titleStyle: TitleFormatting; // Header formatting preference
  sortOrder?: SortOrder; // Ordering mode for container children
  type: 'container' | 'standard';
  content?: string;
  entries?: ContainerEntry[];
  tags: string[];
}