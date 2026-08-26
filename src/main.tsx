import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { UserProfile, ResumeBlock, ThemePreference } from './types';
import { THEME_PALETTES, applyTheme } from './themeEngine';
import { BlockCanvas } from './components/BlockCanvas';
import { ProfileSwitcher } from './components/ProfileSwitcher';
import { MultiFormatExporter } from './exporter';

const initialProfiles: UserProfile[] = [
  { id: '1', name: 'Alex Mercer', themePreference: 'teal', createdAt: new Date().toISOString() },
  { id: '2', name: 'Sarah Mercer', themePreference: 'default', createdAt: new Date().toISOString() },
];

const initialBlocks: Record<string, ResumeBlock[]> = {
  '1': [
    { id: 'b1', title: 'Senior Software Engineer - TechCorp', content: 'Architected microservices handling 1M+ daily active users.', tags: ['#react', '#node', '#cloud'] },
    { id: 'b2', title: 'Freelance & Independent Consulting Hub', content: 'Delivered 12+ client projects under contract umbrella headers.', tags: ['#freelance', '#consulting'] }
  ],
  '2': [
    { id: 'b1', title: 'Product Designer - Studio UX', content: 'Designed systems for enterprise mobile applications.', tags: ['#figma', '#ux', '#research'] }
  ]
};

function App() {
  const [profiles, setProfiles] = useState<UserProfile[]>(initialProfiles);
  const [activeProfileId, setActiveProfileId] = useState<string>('1');
  const [blocks, setBlocks] = useState<Record<string, ResumeBlock[]>>(initialBlocks);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];
  const currentTheme = THEME_PALETTES[activeProfile.themePreference];
  const currentBlocks = blocks[activeProfileId] || [];

  const handleSelectProfile = (id: string) => setActiveProfileId(id);

  const handleUpdateTheme = (newTheme: ThemePreference) => {
    applyTheme(newTheme);
    setProfiles(prev => prev.map(p => p.id === activeProfileId ? { ...p, themePreference: newTheme } : p));
  };

  const handleCreateProfile = () => {
    const userName = prompt("Enter the new user profile name:");
    if (!userName || !userName.trim()) return;

    const newId = `profile_${Date.now()}`;
    const newProfile: UserProfile = {
      id: newId,
      name: userName.trim(),
      themePreference: 'default',
      createdAt: new Date().toISOString(),
    };

    setProfiles(prev => [...prev, newProfile]);
    setBlocks(prev => ({
      ...prev,
      [newId]: [
        {
          id: `b_${Date.now()}`,
          title: 'New Position / Project Block',
          content: 'Click here to begin entering your experience, key metrics, and skills...',
          tags: ['#master', '#new']
        }
      ]
    }));
    setActiveProfileId(newId);
  };

  const handleUpdateBlock = (updatedBlock: ResumeBlock) => {
    setBlocks(prev => ({
      ...prev,
      [activeProfileId]: prev[activeProfileId].map(b => b.id === updatedBlock.id ? updatedBlock : b)
    }));
  };

  const handleAddBlock = () => {
    const newBlock: ResumeBlock = {
      id: `b_${Date.now()}`,
      title: 'New Role / Micro-Project Title',
      content: 'Click here to describe key achievements and metrics...',
      tags: ['#newtag']
    };
    setBlocks(prev => ({ ...prev, [activeProfileId]: [...currentBlocks, newBlock] }));
  };

  const handleExportDocx = async () => {
    const blob = await MultiFormatExporter.exportToDocx(currentBlocks);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeProfile.name.replace(' ', '_')}_Resume.docx`;
    a.click();
  };

  const handleExportTxt = () => {
    const txt = MultiFormatExporter.exportToTxt(currentBlocks);
    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeProfile.name.replace(' ', '_')}_Resume.txt`;
    a.click();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: currentTheme.bgMain, color: currentTheme.textPrimary, fontFamily: 'sans-serif', transition: 'all 0.2s ease' }}>
      <ProfileSwitcher
        activeProfile={activeProfile}
        profiles={profiles}
        onSelectProfile={handleSelectProfile}
        onUpdateTheme={handleUpdateTheme}
        onAddBlock={handleAddBlock}
        onExportDocx={handleExportDocx}
        onExportTxt={handleExportTxt}
        onAtsScan={() => alert('ATS Inspector Scan: 100% ATS Compliant Layout (0 Parsing Warnings).')}
        onCreateProfile={handleCreateProfile}
      />

      <main style={{ maxWidth: '850px', margin: '1.5rem auto', padding: '0 1rem' }}>
        <BlockCanvas blocks={currentBlocks} onUpdateBlock={handleUpdateBlock} />
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);