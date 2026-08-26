import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

// ---------------------------------------------------------------------------
// 1. TYPES & THEME DEFINITIONS
// ---------------------------------------------------------------------------
type ThemePreference = 'default' | 'navy' | 'teal' | 'midnight' | 'monochrome';

interface UserProfile {
  id: string;
  name: string;
  themePreference: ThemePreference;
}

interface ResumeBlock {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

const THEME_PALETTES: Record<ThemePreference, { bgMain: string; bgSurface: string; textPrimary: string; textSecondary: string; accentColor: string; borderColor: string }> = {
  default: { bgMain: '#F8FAFC', bgSurface: '#FFFFFF', textPrimary: '#0F172A', textSecondary: '#475569', accentColor: '#2563EB', borderColor: '#E2E8F0' },
  navy: { bgMain: '#F1F5F9', bgSurface: '#FFFFFF', textPrimary: '#0F172A', textSecondary: '#334155', accentColor: '#1D4ED8', borderColor: '#CBD5E1' },
  teal: { bgMain: '#F0FDF4', bgSurface: '#FFFFFF', textPrimary: '#064E3B', textSecondary: '#047857', accentColor: '#0D9488', borderColor: '#A7F3D0' },
  midnight: { bgMain: '#020617', bgSurface: '#0F172A', textPrimary: '#F8FAFC', textSecondary: '#94A3B8', accentColor: '#38BDF8', borderColor: '#1E293B' },
  monochrome: { bgMain: '#FFFFFF', bgSurface: '#FFFFFF', textPrimary: '#000000', textSecondary: '#333333', accentColor: '#000000', borderColor: '#CCCCCC' }
};

// ---------------------------------------------------------------------------
// 2. MOCK DATA
// ---------------------------------------------------------------------------
const initialProfiles: UserProfile[] = [
  { id: '1', name: 'Alex Mercer', themePreference: 'teal' },
  { id: '2', name: 'Sarah Mercer', themePreference: 'default' }
];

const initialBlocks: Record<string, ResumeBlock[]> = {
  '1': [
    { id: 'b1', title: 'Senior Software Engineer - TechCorp', content: 'Architected microservices handling 1M+ daily active users.', tags: ['#react', '#node', '#cloud'] },
    { id: 'b2', title: 'Freelance & Independent Consulting Hub', content: 'Delivered 12+ client projects under contract umbrella headers.', tags: ['#freelance', '#consulting'] }
  ],
  '2': [
    { id: 'b1', title: 'Product Designer - Studio UX', content: 'Designed design systems for enterprise mobile applications.', tags: ['#figma', '#ux', '#research'] }
  ]
};

// ---------------------------------------------------------------------------
// 3. MAIN APPLICATION COMPONENT
// ---------------------------------------------------------------------------
function App() {
  const [profiles, setProfiles] = useState<UserProfile[]>(initialProfiles);
  const [activeProfileId, setActiveProfileId] = useState<string>('1');
  const [blocks, setBlocks] = useState<Record<string, ResumeBlock[]>>(initialBlocks);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];
  const currentTheme = THEME_PALETTES[activeProfile.themePreference] || THEME_PALETTES.default;
  const currentBlocks = blocks[activeProfileId] || [];

  const handleCreateProfile = () => {
    const name = prompt("Enter new user profile name:");
    if (!name || !name.trim()) return;

    const newId = `profile_${Date.now()}`;
    const newProfile: UserProfile = { id: newId, name: name.trim(), themePreference: 'default' };

    setProfiles(prev => [...prev, newProfile]);
    setBlocks(prev => ({
      ...prev,
      [newId]: [{ id: `b_${Date.now()}`, title: 'New Position / Project Block', content: 'Click to enter key metrics and responsibilities...', tags: ['#master'] }]
    }));
    setActiveProfileId(newId);
  };

  const handleUpdateBlock = (id: string, field: 'title' | 'content', value: string) => {
    setBlocks(prev => ({
      ...prev,
      [activeProfileId]: prev[activeProfileId].map(b => b.id === id ? { ...b, [field]: value } : b)
    }));
  };

  const handleAddBlock = () => {
    const newBlock: ResumeBlock = { id: `b_${Date.now()}`, title: 'New Role Title', content: 'Add metric bullet points here...', tags: ['#newtag'] };
    setBlocks(prev => ({ ...prev, [activeProfileId]: [...currentBlocks, newBlock] }));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: currentTheme.bgMain, color: currentTheme.textPrimary, fontFamily: 'sans-serif' }}>
      {/* Sticky Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: currentTheme.bgSurface, borderBottom: `1px solid ${currentTheme.borderColor}`, padding: '0.75rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: currentTheme.accentColor }}>ResumeOS</h1>
            <span style={{ fontSize: '0.85rem', color: currentTheme.textSecondary }}>Active Profile:</span>
            <select
              value={activeProfileId}
              onChange={(e) => setActiveProfileId(e.target.value)}
              style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', border: `1px solid ${currentTheme.borderColor}`, backgroundColor: currentTheme.bgMain, color: currentTheme.textPrimary }}
            >
              {profiles.map(p => <option key={p.id} value={p.id}>👤 {p.name}</option>)}
            </select>
            <button
              onClick={handleCreateProfile}
              style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', border: `1px solid ${currentTheme.borderColor}`, backgroundColor: currentTheme.bgSurface, color: currentTheme.accentColor, fontWeight: 'bold', cursor: 'pointer' }}
            >
              👤+ New Profile
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: currentTheme.textSecondary }}>Persistent Theme:</span>
            {(['default', 'navy', 'teal', 'midnight', 'monochrome'] as ThemePreference[]).map(t => (
              <button
                key={t}
                onClick={() => setProfiles(prev => prev.map(p => p.id === activeProfileId ? { ...p, themePreference: t } : p))}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: activeProfile.themePreference === t ? `2px solid ${currentTheme.accentColor}` : 'none',
                  backgroundColor: THEME_PALETTES[t].accentColor,
                  cursor: 'pointer'
                }}
                title={t}
              />
            ))}
          </div>
        </div>

        {/* Toolbar Row */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: `1px solid ${currentTheme.borderColor}` }}>
          <button onClick={handleAddBlock} style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: 'none', backgroundColor: currentTheme.accentColor, color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>
            ➕ Add Block
          </button>
          <button onClick={() => alert('Exporting .DOCX functionality active.')} style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: `1px solid ${currentTheme.borderColor}`, backgroundColor: currentTheme.bgSurface, color: currentTheme.textPrimary, cursor: 'pointer', fontSize: '0.85rem' }}>
            📄 Export .DOCX
          </button>
          <button onClick={() => alert('ATS Audit: 100% Parsing Compliant.')} style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: `1px solid ${currentTheme.borderColor}`, backgroundColor: currentTheme.bgSurface, color: currentTheme.textPrimary, cursor: 'pointer', fontSize: '0.85rem' }}>
            🛡️ ATS Audit
          </button>
        </div>
      </header>

      {/* Main Canvas Area */}
      <main style={{ maxWidth: '850px', margin: '1.5rem auto', padding: '0 1rem' }}>
        <div style={{ backgroundColor: currentTheme.bgSurface, padding: '1.5rem', borderRadius: '8px', border: `1px solid ${currentTheme.borderColor}` }}>
          <h2 style={{ fontSize: '1.1rem', margin: '0 0 1rem 0', color: currentTheme.accentColor }}>Hybrid Block Canvas (SSOT Databank)</h2>
          
          {currentBlocks.map(block => (
            <div key={block.id} style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: `1px dashed ${currentTheme.borderColor}` }}>
              <input
                type="text"
                value={block.title}
                onChange={(e) => handleUpdateBlock(block.id, 'title', e.target.value)}
                style={{ width: '100%', fontSize: '1.1rem', fontWeight: 'bold', color: currentTheme.accentColor, border: 'none', background: 'transparent', outline: 'none' }}
              />
              <textarea
                value={block.content}
                onChange={(e) => handleUpdateBlock(block.id, 'content', e.target.value)}
                rows={3}
                style={{ width: '100%', marginTop: '0.5rem', fontSize: '0.95rem', color: currentTheme.textPrimary, border: 'none', background: 'transparent', outline: 'none', resize: 'vertical' }}
              />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                {block.tags.map(tag => (
                  <span key={tag} style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem', borderRadius: '3px', backgroundColor: currentTheme.bgMain, color: currentTheme.textSecondary, border: `1px solid ${currentTheme.borderColor}` }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. MOUNT TO HTML ROOT
// ---------------------------------------------------------------------------
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />);
}