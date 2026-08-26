import { ThemePreference } from '../shared/types';

export interface ColorTokens {
  '--bg-main': string;
  '--bg-surface': string;
  '--text-primary': string;
  '--text-secondary': string;
  '--accent-color': string;
  '--border-color': string;
}

export const THEME_PALETTES: Record<ThemePreference, ColorTokens> = {
  default: {
    '--bg-main': '#F8FAFC',
    '--bg-surface': '#FFFFFF',
    '--text-primary': '#0F172A',
    '--text-secondary': '#475569',
    '--accent-color': '#2563EB',
    '--border-color': '#E2E8F0',
  },
  navy: {
    '--bg-main': '#F1F5F9',
    '--bg-surface': '#FFFFFF',
    '--text-primary': '#0F172A',
    '--text-secondary': '#334155',
    '--accent-color': '#1D4ED8',
    '--border-color': '#CBD5E1',
  },
  teal: {
    '--bg-main': '#F0FDF4',
    '--bg-surface': '#FFFFFF',
    '--text-primary': '#064E3B',
    '--text-secondary': '#047857',
    '--accent-color': '#0D9488',
    '--border-color': '#A7F3D0',
  },
  midnight: {
    '--bg-main': '#020617',
    '--bg-surface': '#0F172A',
    '--text-primary': '#F8FAFC',
    '--text-secondary': '#94A3B8',
    '--accent-color': '#38BDF8',
    '--border-color': '#1E293B',
  },
  monochrome: {
    '--bg-main': '#FFFFFF',
    '--bg-surface': '#FFFFFF',
    '--text-primary': '#000000',
    '--text-secondary': '#333333',
    '--accent-color': '#000000',
    '--border-color': '#CCCCCC',
  }
};

export function applyTheme(theme: ThemePreference): void {
  const tokens = THEME_PALETTES[theme] || THEME_PALETTES.default;
  const root = document.documentElement;

  Object.entries(tokens).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
}

export function saveProfileTheme(profileId: string, theme: ThemePreference): void {
  applyTheme(theme);
  const storedProfile = JSON.parse(localStorage.getItem(`profile_${profileId}`) || '{}');
  storedProfile.themePreference = theme;
  localStorage.setItem(`profile_${profileId}`, JSON.stringify(storedProfile));
}