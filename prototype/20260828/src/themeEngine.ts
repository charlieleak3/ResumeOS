import { ThemePreference } from './types';

export interface ColorTokens {
  bgMain: string;
  bgSurface: string;
  textPrimary: string;
  textSecondary: string;
  accentColor: string;
  borderColor: string;
}

export const THEME_PALETTES: Record<ThemePreference, ColorTokens> = {
  default: {
    bgMain: '#F8FAFC',
    bgSurface: '#FFFFFF',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    accentColor: '#2563EB',
    borderColor: '#E2E8F0',
  },
  navy: {
    bgMain: '#F1F5F9',
    bgSurface: '#FFFFFF',
    textPrimary: '#0F172A',
    textSecondary: '#334155',
    accentColor: '#1D4ED8',
    borderColor: '#CBD5E1',
  },
  teal: {
    bgMain: '#F0FDF4',
    bgSurface: '#FFFFFF',
    textPrimary: '#064E3B',
    textSecondary: '#047857',
    accentColor: '#0D9488',
    borderColor: '#A7F3D0',
  },
  midnight: {
    bgMain: '#020617',
    bgSurface: '#0F172A',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    accentColor: '#38BDF8',
    borderColor: '#1E293B',
  },
  monochrome: {
    bgMain: '#FFFFFF',
    bgSurface: '#FFFFFF',
    textPrimary: '#000000',
    textSecondary: '#333333',
    accentColor: '#000000',
    borderColor: '#CCCCCC',
  }
};
