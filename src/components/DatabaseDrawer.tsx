import React, { useState } from 'react';

interface DatabaseDrawerProps {
  blocks: Record<string, any>;
  profiles: any[];
  activeProfileId: string;
  theme: any;
  onImportDatabase: (newBlocks: Record<string, any>) => void;
  onClose: () => void;
}

export const DatabaseDrawer: React.FC<DatabaseDrawerProps> = ({
  blocks,
  profiles,
  activeProfileId,
  theme,
  onImportDatabase,
  onClose,
}) => {
  const [jsonString, setJsonString] = useState(() => JSON.stringify(blocks, null, 2));
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');
  const [error, setError] = useState<string | null>(null);

  const activeProfile = profiles.find(p => p.id === activeProfileId);
  const currentProfileBlocks = blocks[activeProfileId] || [];

  // Handle Manual Save of Edited JSON
  const handleSaveJson = () => {
    try {
      const parsed = JSON.parse(jsonString);
      onImportDatabase(parsed);
      setError(null);
      alert("Database updated successfully!");
    } catch (err: any) {
      setError(`Invalid JSON Syntax: ${err.message}`);
    }
  };

  // Export JSON File
  const handleExportFile = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resumeos_databank_${activeProfile?.name.toLowerCase().replace(/\s+/g, '_') || 'export'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '550px', maxWidth: '90vw', backgroundColor: theme.bgSurface, borderLeft: `1px solid ${theme.borderColor}`, boxShadow: '-10px 0 30px rgba(0,0,0,0.2)', zIndex: 1500, display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ padding: '0.75rem 1.25rem', backgroundColor: theme.bgMain, borderBottom: `1px solid ${theme.borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem' }}>🗄️</span>
          <strong style={{ color: theme.accentColor }}>Master Database Manager</strong>
        </div>
        <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer', color: theme.textSecondary }}>✕</button>
      </div>

      {/* Mode Tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${theme.borderColor}`, backgroundColor: theme.bgSurface }}>
        <button
          onClick={() => setActiveTab('visual')}
          style={{ flex: 1, padding: '0.6rem', border: 'none', borderBottom: activeTab === 'visual' ? `2px solid ${theme.accentColor}` : 'none', background: 'transparent', color: activeTab === 'visual' ? theme.accentColor : theme.textSecondary, fontWeight: 'bold', cursor: 'pointer' }}
        >
          📊 Visual DB Summary
        </button>
        <button
          onClick={() => setActiveTab('json')}
          style={{ flex: 1, padding: '0.6rem', border: 'none', borderBottom: activeTab === 'json' ? `2px solid ${theme.accentColor}` : 'none', background: 'transparent', color: activeTab === 'json' ? theme.accentColor : theme.textSecondary, fontWeight: 'bold', cursor: 'pointer' }}
        >
          💻 Raw JSON Editor
        </button>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', backgroundColor: theme.bgSurface }}>
        {activeTab === 'visual' ? (
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: theme.textPrimary }}>Active Profile Keys & Entries</h4>
            <div style={{ fontSize: '0.85rem', color: theme.textSecondary, marginBottom: '1rem' }}>
              Showing {currentProfileBlocks.length} top-level blocks for <strong>{activeProfile?.name}</strong>.
            </div>

            {currentProfileBlocks.map((block: any) => (
              <div key={block.id} style={{ marginBottom: '0.75rem', padding: '0.75rem', borderRadius: '4px', border: `1px solid ${theme.borderColor}`, backgroundColor: theme.bgMain }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '0.9rem', color: theme.accentColor }}>
                  <span>{block.title}</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{block.sectionKey}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: theme.textSecondary, marginTop: '0.2rem' }}>
                  Type: <code>{block.type}</code> | Format: <code>{block.titleStyle}</code>
                  {block.entries && ` | ${block.entries.length} items (${block.entries.filter((e: any) => e.selected).length} selected)`}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {error && <div style={{ padding: '0.5rem', marginBottom: '0.5rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px', fontSize: '0.8rem' }}>{error}</div>}
            <textarea
              value={jsonString}
              onChange={(e) => setJsonString(e.target.value)}
              style={{ flex: 1, width: '100%', fontFamily: 'monospace', fontSize: '0.85rem', padding: '0.75rem', border: `1px solid ${theme.borderColor}`, borderRadius: '4px', backgroundColor: theme.bgMain, color: theme.textPrimary, resize: 'none' }}
              placeholder="Paste or edit database JSON here..."
            />
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div style={{ padding: '0.75rem 1.25rem', backgroundColor: theme.bgMain, borderTop: `1px solid ${theme.borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={handleExportFile} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '4px', border: `1px solid ${theme.borderColor}`, backgroundColor: theme.bgSurface, color: theme.textPrimary, cursor: 'pointer' }}>
          💾 Export .JSON
        </button>

        {activeTab === 'json' && (
          <button onClick={handleSaveJson} style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', borderRadius: '4px', border: 'none', backgroundColor: theme.accentColor, color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
            Apply DB Changes
          </button>
        )}
      </div>

    </div>
  );
};