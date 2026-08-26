// Update ProfileSwitcherProps interface to include:
interface ProfileSwitcherProps {
  activeProfile: UserProfile;
  profiles: UserProfile[];
  onSelectProfile: (profileId: string) => void;
  onUpdateTheme: (theme: ThemePreference) => void;
  onCreateProfile?: () => void; // <--- Added prop
  // ...other props
}

// Inside the Profile Switcher JSX dropdown container:
<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
  <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: 'var(--accent-color, #2563eb)' }}>ResumeOS</h1>
  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #475569)' }}>Active Profile:</span>
  
  <select
    value={activeProfile.id}
    onChange={(e) => onSelectProfile(e.target.value)}
    style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border-color, #e2e8f0)', backgroundColor: 'var(--bg-main, #f8fafc)', color: 'var(--text-primary, #0f172a)' }}
  >
    {profiles.map((p) => (
      <option key={p.id} value={p.id}>
        👤 {p.name}
      </option>
    ))}
  </select>

  {/* NEW USER CREATION BUTTON */}
  <button
    onClick={onCreateProfile}
    style={{
      padding: '0.3rem 0.6rem',
      borderRadius: '4px',
      border: '1px solid var(--border-color, #e2e8f0)',
      backgroundColor: 'var(--bg-surface, #fff)',
      color: 'var(--accent-color, #2563eb)',
      fontSize: '0.85rem',
      fontWeight: 'bold',
      cursor: 'pointer'
    }}
    title="Create a new user profile"
  >
    👤+ New Profile
  </button>
</div>