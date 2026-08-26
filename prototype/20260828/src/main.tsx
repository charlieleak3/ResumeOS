import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { UserProfile, ResumeBlock, ThemePreference } from './types';
import { THEME_PALETTES } from './themeEngine';

const initialProfiles: UserProfile[] = [
  { id: '1', name: 'Alex Mercer', themePreference: 'default' },
  { id: '2', name: 'Sarah Mercer', themePreference: 'teal' },
];

const initialBlocks: Record<string, ResumeBlock[]> = {
  '1': [
    { id: 'b1', title: 'Senior Software Engineer - TechCorp', content: 'Architected microservices handling 1M+ daily active users.', tags: ['#react', '#node', '#cloud'] },
    { id: 'b2', title: 'Freelance & Independent Consulting Hub', content: 'Delivered 12+ client projects under contract umbrella headers.', tags: ['#freelance', '#consulting'] }
  ],
  '2': [
    { id: 'b1', title: 'Product Designer - Studio UX', content: 'Designed design systems for enterprise mobile apps.', tags: ['#figma', '#ux', '#research'] }
  ]
};

function App() {
  const [profiles, setProfiles] = useState<UserProfile[]>(initialProfiles);
  const [activeProfileId, setActiveProfileId] = useState<string>('1');
  const [blocks, setBlocks] = useState<Record<string, ResumeBlock[]>>(initialBlocks);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];
  const currentTheme = THEME_PALETTES[activeProfile.themePreference];

  const handleThemeChange = (newTheme: ThemePreference) => {
    setProfiles(prev => prev.map(p => p.id === activeProfileId ? { ...p, themePreference: newTheme } : p));
  };

  const currentBlocks = blocks[activeProfileId] || [];

  const updateBlock = (id: string, field: 'title' | 'content', value: string) => {
    setBlocks(prev => ({
      ...prev,
      [activeProfileId]: prev[activeProfileId].map(b => b.id === id ? { ...b, [field]: value } : b)
    }));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: currentTheme.bgMain, color: currentTheme.textPrimary, fontFamily: 'sans-serif', transition: 'all 0.2s ease' }}>
      {/* Top Header & Switcher */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: currentTheme.bgSurface, borderBottom: `1px solid ${currentTheme.borderColor}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: currentTheme.accentColor }}>ResumeOS</h1>
          <span style={{ fontSize: '0.875rem', color: currentTheme.textSecondary }}>Active Profile:</span>
          <select 
            value={activeProfileId} 
            onChange={(e) => setActiveProfileId(e.target.value)}
            style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: `1px solid ${currentTheme.borderColor}`, backgroundColor: currentTheme.bgMain, color: currentTheme.textPrimary }}
          >
            {profiles.map(p => <option key={p.id} value={p.id}>👤 {p.name}</option>)}
          </select>
        </div>

        {/* Theme Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: currentTheme.textSecondary }}>Persistent Theme:</span>
          {(['default', 'navy', 'teal', 'midnight', 'monochrome'] as ThemePreference[]).map(t => (
            <button
              key={t}
              onClick={() => handleThemeChange(t)}
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                border: activeProfile.themePreference === t ? `2px solid ${currentTheme.accentColor}` : '2px solid transparent',
                backgroundColor: THEME_PALETTES[t].accentColor,
                cursor: 'pointer',
                transform: activeProfile.themePreference === t ? 'scale(1.2)' : 'scale(1)'
              }}
              title={t}
            />
          ))}
        </div>
      </header>

      {/* Editor Canvas */}
      <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem', backgroundColor: currentTheme.bgSurface, borderRadius: '8px', border: `1px solid ${currentTheme.borderColor}`, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: `1px solid ${currentTheme.borderColor}`, paddingBottom: '0.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Hybrid Block Canvas (SSOT)</h2>
          <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: currentTheme.bgMain, border: `1px solid ${currentTheme.borderColor}` }}>Profile ID: {activeProfile.id}</span>
        </div>

        {currentBlocks.map(block => (
          <div key={block.id} style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: `1px dashed ${currentTheme.borderColor}` }}>
            <input
              type="text"
              value={block.title}
              onChange={(e) => updateBlock(block.id, 'title', e.target.value)}
              style={{ width: '100%', fontSize: '1.1rem', fontWeight: 'bold', color: currentTheme.accentColor, border: 'none', background: 'transparent', outline: 'none', marginBottom: '0.5rem' }}
            />
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
              rows={3}
              style={{ width: '100%', fontSize: '0.95rem', color: currentTheme.textPrimary, border: 'none', background: 'transparent', outline: 'none', resize: 'vertical' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              {block.tags.map(tag => (
                <span key={tag} style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem', borderRadius: '3px', backgroundColor: currentTheme.bgMain, color: currentTheme.textSecondary, border: `1px solid ${currentTheme.borderColor}` }}>{tag}</span>
              ))}
            </div>
          </div>
        ))}

        <button 
          onClick={() => alert(`Exporting ${activeProfile.name}'s resume snapshot as native .docx and .pdf...`)}
          style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: 'none', backgroundColor: currentTheme.accentColor, color: '#fff', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' }}
        >
          Export Snapshot (.docx / .pdf / .odt)
        </button>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
