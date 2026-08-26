import React from 'react';
import { UserProfile, ThemePreference } from '../../shared/types';
import { saveProfileTheme, THEME_PALETTES } from '../themeEngine';

interface ProfileSwitcherProps {
  activeProfile: UserProfile;
  profiles: UserProfile[];
  onSelectProfile: (profileId: string) => void;
  onUpdateTheme: (theme: ThemePreference) => void;
}

export const ProfileSwitcher: React.FC<ProfileSwitcherProps> = ({
  activeProfile,
  profiles,
  onSelectProfile,
  onUpdateTheme,
}) => {
  const themes: ThemePreference[] = ['default', 'navy', 'teal', 'midnight', 'monochrome'];

  return (
    <div className="flex items-center justify-between p-4 bg-[var(--bg-surface)] border-b border-[var(--border-color)] text-[var(--text-primary)]">
      <div className="flex items-center gap-4">
        <span className="font-semibold text-sm">Active Profile:</span>
        <select
          className="bg-[var(--bg-main)] border border-[var(--border-color)] px-3 py-1.5 rounded text-sm outline-none"
          value={activeProfile.id}
          onChange={(e) => onSelectProfile(e.target.value)}
        >
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>
              👤 {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--text-secondary)]">Theme:</span>
        {themes.map((themeKey) => (
          <button
            key={themeKey}
            className={`w-6 h-6 rounded-full border-2 transition-transform ${
              activeProfile.themePreference === themeKey ? 'scale-110 border-[var(--accent-color)]' : 'border-transparent'
            }`}
            style={{ backgroundColor: THEME_PALETTES[themeKey]['--accent-color'] }}
            onClick={() => {
              saveProfileTheme(activeProfile.id, themeKey);
              onUpdateTheme(themeKey);
            }}
            title={`Switch to ${themeKey} theme`}
          />
        ))}
      </div>
    </div>
  );
};