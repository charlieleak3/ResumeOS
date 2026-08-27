import { ThemePreference, UserProfile, ResumeBlock } from '../types';

export const THEME_PALETTES: Record<ThemePreference, { bgMain: string; bgSurface: string; textPrimary: string; textSecondary: string; accentColor: string; borderColor: string }> = {
  default: { bgMain: '#F8FAFC', bgSurface: '#FFFFFF', textPrimary: '#0F172A', textSecondary: '#475569', accentColor: '#2563EB', borderColor: '#E2E8F0' },
  navy: { bgMain: '#F1F5F9', bgSurface: '#FFFFFF', textPrimary: '#0F172A', textSecondary: '#334155', accentColor: '#1D4ED8', borderColor: '#CBD5E1' },
  teal: { bgMain: '#F0FDF4', bgSurface: '#FFFFFF', textPrimary: '#064E3B', textSecondary: '#047857', accentColor: '#0D9488', borderColor: '#A7F3D0' },
  midnight: { bgMain: '#020617', bgSurface: '#0F172A', textPrimary: '#F8FAFC', textSecondary: '#94A3B8', accentColor: '#38BDF8', borderColor: '#1E293B' },
  monochrome: { bgMain: '#FFFFFF', bgSurface: '#FFFFFF', textPrimary: '#000000', textSecondary: '#333333', accentColor: '#000000', borderColor: '#CCCCCC' }
};

export const INITIAL_PROFILES: UserProfile[] = [
  { id: '1', name: 'Charlie Leak', themePreference: 'teal' }
];

export const INITIAL_BLOCKS: Record<string, ResumeBlock[]> = {
  '1': [
    {
      id: 'b_summary',
      title: 'Professional Summary',
      sectionKey: '#summary',
      titleStyle: 'bold',
      type: 'standard',
      content: 'Lead Electrical Engineer with over 20 years of experience across Automotive and Defense sectors. Certified GM Six Sigma Black Belt (DFSS) specializing in embedded software architecture and ECU algorithms.',
      tags: ['#summary', '#master']
    },
    {
      id: 'b_edu_container',
      title: 'Education/Certifications',
      sectionKey: '#education',
      titleStyle: 'bold',
      type: 'container',
      tags: ['#education', '#credentials'],
      entries: [
        {
          id: 'edu_1',
          title: 'Bachelor of Science, Electrical Engineering (BSEE)',
          subtitle: 'Tuskegee University',
          dateRange: 'Tuskegee, AL',
          selected: true,
          content: 'Completed core curriculum with specialization in electrical systems.'
        },
        {
          id: 'edu_2',
          title: 'Certified Six Sigma Black Belt (DFSS Track)',
          subtitle: 'General Motors',
          dateRange: '2018',
          selected: true,
          content: 'Design for Six Sigma execution across embedded software control modules.'
        }
      ]
    },
    {
      id: 'b_work_container',
      title: 'Professional Experience',
      sectionKey: '#work_history',
      titleStyle: 'bold',
      type: 'container',
      tags: ['#work_history'],
      entries: [
        {
          id: 'work_1',
          title: 'Lead Electrical Engineer',
          subtitle: 'Booz Allen Hamilton | Huntsville, AL',
          dateRange: 'Feb 2023 - Dec 2025',
          selected: true,
          content: 'Performed technical research to identify and qualify engineering achievements, directly supporting strategic proposal development for the Army Account.'
        }
      ]
    }
  ]
};