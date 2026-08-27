import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { UserProfile, ResumeBlock, ContainerEntry, DatePeriod, TitleFormatting, SortOrder } from './types';
import { THEME_PALETTES, INITIAL_PROFILES, INITIAL_BLOCKS } from './constants/theme';
import { WordProcessorModal } from './components/WordProcessorModal';
import { DatabaseDrawer } from './components/DatabaseDrawer';
import { DatePeriodSelector } from './components/DatePeriodSelector';

const MONTH_MAP: Record<string, number> = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
};

function App() {
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('resumeos_profiles');
    return saved ? JSON.parse(saved) : INITIAL_PROFILES;
  });

  const [blocks, setBlocks] = useState<Record<string, ResumeBlock[]>>(() => {
    const saved = localStorage.getItem('resumeos_blocks');
    return saved ? JSON.parse(saved) : INITIAL_BLOCKS;
  });

  const [activeProfileId, setActiveProfileId] = useState<string>(profiles[0]?.id || '1');
  
  // Drag-and-Drop Tracking
  const [draggedBlockIndex, setDraggedBlockIndex] = useState<number | null>(null);
  const [draggedEntryInfo, setDraggedEntryInfo] = useState<{ containerId: string; index: number } | null>(null);

  // UI Modals & Drawers
  const [showDatabaseDrawer, setShowDatabaseDrawer] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'block' | 'entry'; blockId: string; entryId?: string; title: string } | null>(null);
  const [expandedEditor, setExpandedEditor] = useState<{ type: 'block' | 'entry'; blockId: string; entryId?: string; title: string; content: string } | null>(null);

  useEffect(() => { localStorage.setItem('resumeos_profiles', JSON.stringify(profiles)); }, [profiles]);
  useEffect(() => { localStorage.setItem('resumeos_blocks', JSON.stringify(blocks)); }, [blocks]);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];
  const currentTheme = THEME_PALETTES[activeProfile?.themePreference || 'default'];
  const currentBlocks = blocks[activeProfileId] || [];

  const handleAddBlock = (type: 'standard' | 'container') => {
    const defaultTitle = type === 'container' ? "Work Experience Container" : "New Custom Block";
    const customTitle = prompt(`Enter title for new ${type === 'container' ? 'container' : 'block'}:`, defaultTitle);
    if (customTitle === null) return;

    const titleToUse = customTitle.trim() || defaultTitle;
    const keySlug = `#${titleToUse.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    const newBlock: ResumeBlock = type === 'container' 
      ? { id: `b_cnt_${Date.now()}`, title: titleToUse, sectionKey: keySlug, titleStyle: 'bold', sortOrder: 'chronological-desc', type: 'container', tags: [keySlug], entries: [] }
      : { id: `b_std_${Date.now()}`, title: titleToUse, sectionKey: keySlug, titleStyle: 'bold', type: 'standard', content: 'Enter text content here...', tags: [keySlug] };

    setBlocks(prev => ({ ...prev, [activeProfileId]: [...currentBlocks, newBlock] }));
  };

  const handleAddEntryToContainer = (containerId: string) => {
    const defaultPeriod: DatePeriod = {
      startMonth: 'Jan',
      startYear: new Date().getFullYear().toString(),
      endMonth: 'Dec',
      endYear: new Date().getFullYear().toString(),
      isCurrent: true
    };

    const newEntry: ContainerEntry = {
      id: `entry_${Date.now()}`,
      title: 'Degree / Certificate / Role Title',
      subtitle: 'Institution / Organization / Company',
      datePeriod: defaultPeriod,
      dateRange: `Jan ${defaultPeriod.startYear} – Present`,
      selected: true,
      content: 'Describe key coursework, achievements, or project metrics...'
    };

    setBlocks(prev => ({
      ...prev,
      [activeProfileId]: prev[activeProfileId].map(block => {
        if (block.id !== containerId) return block;
        return { ...block, entries: [...(block.entries || []), newEntry] };
      })
    }));
  };

  const handleUpdateStandardBlock = (id: string, field: keyof ResumeBlock, value: any) => {
    setBlocks(prev => ({
      ...prev,
      [activeProfileId]: prev[activeProfileId].map(b => b.id === id ? { ...b, [field]: value } : b)
    }));
  };

  const handleUpdateEntryField = (containerId: string, entryId: string, field: keyof ContainerEntry, value: any) => {
    setBlocks(prev => ({
      ...prev,
      [activeProfileId]: prev[activeProfileId].map(block => {
        if (block.id !== containerId || !block.entries) return block;
        return {
          ...block,
          entries: block.entries.map(entry => entry.id === entryId ? { ...entry, [field]: value } : entry)
        };
      })
    }));
  };

  const handleToggleEntrySelection = (containerId: string, entryId: string) => {
    setBlocks(prev => ({
      ...prev,
      [activeProfileId]: prev[activeProfileId].map(block => {
        if (block.id !== containerId || !block.entries) return block;
        return {
          ...block,
          entries: block.entries.map(entry => entry.id === entryId ? { ...entry, selected: !entry.selected } : entry)
        };
      })
    }));
  };

  // Helper: Sort entries chronologically
  const getSortedEntries = (entries: ContainerEntry[] = [], sortOrder: SortOrder = 'manual') => {
    if (sortOrder === 'manual') return entries;

    return [...entries].sort((a, b) => {
      const yearA = parseInt(a.datePeriod?.startYear || '0', 10);
      const yearB = parseInt(b.datePeriod?.startYear || '0', 10);
      const monthA = MONTH_MAP[a.datePeriod?.startMonth || 'Jan'] || 1;
      const monthB = MONTH_MAP[b.datePeriod?.startMonth || 'Jan'] || 1;

      const dateValA = yearA * 100 + monthA;
      const dateValB = yearB * 100 + monthB;

      return sortOrder === 'chronological-desc' ? dateValB - dateValA : dateValA - dateValB;
    });
  };

  // Drag-and-Drop: Parent Blocks
  const handleBlockDragStart = (index: number) => setDraggedBlockIndex(index);
  const handleBlockDrop = (dropIndex: number) => {
    if (draggedBlockIndex === null || draggedBlockIndex === dropIndex) return;
    const updated = [...currentBlocks];
    const [movedBlock] = updated.splice(draggedBlockIndex, 1);
    updated.splice(dropIndex, 0, movedBlock);
    setBlocks(prev => ({ ...prev, [activeProfileId]: updated }));
    setDraggedBlockIndex(null);
  };

  // Drag-and-Drop: Child Entries inside Container
  const handleEntryDragStart = (containerId: string, index: number) => setDraggedEntryInfo({ containerId, index });
  const handleEntryDrop = (containerId: string, dropIndex: number) => {
    if (!draggedEntryInfo || draggedEntryInfo.containerId !== containerId || draggedEntryInfo.index === dropIndex) return;
    
    setBlocks(prev => ({
      ...prev,
      [activeProfileId]: prev[activeProfileId].map(block => {
        if (block.id !== containerId || !block.entries) return block;
        const updatedEntries = [...block.entries];
        const [movedEntry] = updatedEntries.splice(draggedEntryInfo.index, 1);
        updatedEntries.splice(dropIndex, 0, movedEntry);
        return { ...block, sortOrder: 'manual', entries: updatedEntries }; // Switch to manual sort on drop
      })
    }));

    setDraggedEntryInfo(null);
  };

  const handleSaveExpandedContent = (newTitle: string, newContent: string) => {
    if (!expandedEditor) return;

    if (expandedEditor.type === 'block') {
      handleUpdateStandardBlock(expandedEditor.blockId, 'title', newTitle);
      handleUpdateStandardBlock(expandedEditor.blockId, 'content', newContent);
    } else if (expandedEditor.type === 'entry' && expandedEditor.entryId) {
      handleUpdateEntryField(expandedEditor.blockId, expandedEditor.entryId, 'title', newTitle);
      handleUpdateEntryField(expandedEditor.blockId, expandedEditor.entryId, 'content', newContent);
    }

    setExpandedEditor(null);
  };

  const executeDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'block') {
      setBlocks(prev => ({
        ...prev,
        [activeProfileId]: prev[activeProfileId].filter(b => b.id !== deleteTarget.blockId)
      }));
    } else if (deleteTarget.type === 'entry' && deleteTarget.entryId) {
      setBlocks(prev => ({
        ...prev,
        [activeProfileId]: prev[activeProfileId].map(block => {
          if (block.id !== deleteTarget.blockId || !block.entries) return block;
          return { ...block, entries: block.entries.filter(e => e.id !== deleteTarget.entryId) };
        })
      }));
    }

    setDeleteTarget(null);
  };

  const getHeaderFontStyle = (style: TitleFormatting): React.CSSProperties => {
    switch (style) {
      case 'bold': return { fontWeight: 'bold', textTransform: 'none' };
      case 'uppercase': return { fontWeight: 'normal', textTransform: 'uppercase' };
      case 'bold-uppercase': return { fontWeight: 'bold', textTransform: 'uppercase' };
      default: return { fontWeight: 'normal', textTransform: 'none' };
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: currentTheme.bgMain, color: currentTheme.textPrimary, fontFamily: 'sans-serif' }}>
      {/* Header Navigation */}
      <header style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: currentTheme.bgSurface, borderBottom: `1px solid ${currentTheme.borderColor}`, padding: '0.75rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.25rem', margin: 0, color: currentTheme.accentColor }}>ResumeOS</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <select value={activeProfileId} onChange={(e) => setActiveProfileId(e.target.value)} style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', border: `1px solid ${currentTheme.borderColor}`, backgroundColor: currentTheme.bgMain, color: currentTheme.textPrimary }}>
              {profiles.map(p => <option key={p.id} value={p.id}>👤 {p.name}</option>)}
            </select>
            <button onClick={() => setShowDatabaseDrawer(true)} style={{ padding: '0.3rem 0.7rem', borderRadius: '4px', border: `1px solid ${currentTheme.borderColor}`, backgroundColor: currentTheme.bgMain, color: currentTheme.accentColor, fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>
              🗄️ Manage Database
            </button>
          </div>
        </div>

        {/* Global Toolbar */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
          <button onClick={() => handleAddBlock('standard')} style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: 'none', backgroundColor: currentTheme.accentColor, color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>➕ Standard Block</button>
          <button onClick={() => handleAddBlock('container')} style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: `1px solid ${currentTheme.accentColor}`, backgroundColor: currentTheme.bgMain, color: currentTheme.accentColor, fontWeight: 'bold', cursor: 'pointer' }}>📁 Add New Container</button>
        </div>
      </header>

      {/* Main Canvas Workspace */}
      <main style={{ maxWidth: '940px', margin: '1.5rem auto', padding: '0 1rem' }}>
        <div style={{ backgroundColor: currentTheme.bgSurface, padding: '1.5rem', borderRadius: '8px', border: `1px solid ${currentTheme.borderColor}` }}>
          <h2>Master Databank Canvas ({activeProfile?.name})</h2>

          {currentBlocks.map((block, index) => {
            const sortedEntries = getSortedEntries(block.entries, block.sortOrder || 'manual');

            return (
              <div
                key={block.id}
                draggable
                onDragStart={() => handleBlockDragStart(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleBlockDrop(index)}
                style={{
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  borderRadius: '6px',
                  backgroundColor: draggedBlockIndex === index ? currentTheme.bgMain : 'transparent',
                  border: `1px dashed ${draggedBlockIndex === index ? currentTheme.accentColor : currentTheme.borderColor}`
                }}
              >
                
                {/* Header Title & Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                    <span style={{ cursor: 'grab', color: currentTheme.textSecondary, fontSize: '1.1rem' }} title="Drag block to reorder">⋮⋮</span>
                    
                    <input
                      type="text"
                      value={block.title}
                      onChange={(e) => handleUpdateStandardBlock(block.id, 'title', e.target.value)}
                      style={{
                        fontSize: '1.1rem',
                        color: currentTheme.accentColor,
                        border: 'none',
                        background: 'transparent',
                        outline: 'none',
                        width: '38%',
                        ...getHeaderFontStyle(block.titleStyle)
                      }}
                    />

                    {/* Group Key Tag */}
                    <input
                      type="text"
                      value={block.sectionKey}
                      onChange={(e) => handleUpdateStandardBlock(block.id, 'sectionKey', e.target.value)}
                      placeholder="#group_key"
                      style={{ fontSize: '0.75rem', color: currentTheme.textSecondary, border: `1px solid ${currentTheme.borderColor}`, borderRadius: '3px', padding: '0.1rem 0.4rem', backgroundColor: currentTheme.bgMain, width: '100px' }}
                      title="Grouping Key Identifier for SSOT exports"
                    />

                    {/* Header Formatting Selection */}
                    <select
                      value={block.titleStyle}
                      onChange={(e) => handleUpdateStandardBlock(block.id, 'titleStyle', e.target.value as TitleFormatting)}
                      style={{ fontSize: '0.75rem', padding: '0.1rem 0.3rem', borderRadius: '3px', border: `1px solid ${currentTheme.borderColor}`, backgroundColor: currentTheme.bgMain, color: currentTheme.textSecondary }}
                    >
                      <option value="bold">Bold Title</option>
                      <option value="uppercase">UPPERCASE Title</option>
                      <option value="bold-uppercase">BOLD UPPERCASE</option>
                      <option value="normal">Standard Title</option>
                    </select>

                    {/* Container Child Sorting Selector */}
                    {block.type === 'container' && (
                      <select
                        value={block.sortOrder || 'chronological-desc'}
                        onChange={(e) => handleUpdateStandardBlock(block.id, 'sortOrder', e.target.value as SortOrder)}
                        style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem', borderRadius: '3px', border: `1px solid ${currentTheme.borderColor}`, backgroundColor: currentTheme.bgMain, color: currentTheme.accentColor, fontWeight: 'bold' }}
                        title="Select child entry ordering mode"
                      >
                        <option value="chronological-desc">📅 Newest First</option>
                        <option value="chronological-asc">📅 Oldest First</option>
                        <option value="manual">✋ Manual (Drag Handles)</option>
                      </select>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    {block.type === 'container' && <button onClick={() => handleAddEntryToContainer(block.id)} style={{ padding: '0.25rem 0.6rem', borderRadius: '4px', border: `1px solid ${currentTheme.accentColor}`, backgroundColor: currentTheme.accentColor, color: '#fff', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}>➕ Add Item</button>}
                    {block.type === 'standard' && <button onClick={() => setExpandedEditor({ type: 'block', blockId: block.id, title: block.title, content: block.content || '' })} style={{ padding: '0.25rem 0.6rem', borderRadius: '4px', border: `1px solid ${currentTheme.borderColor}`, backgroundColor: currentTheme.bgMain, color: currentTheme.accentColor, fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}>🔍 Expand Word Processor</button>}
                    <button onClick={() => setDeleteTarget({ type: 'block', blockId: block.id, title: block.title })} style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', border: `1px solid ${currentTheme.borderColor}`, backgroundColor: currentTheme.bgMain, color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer' }}>🗑️</button>
                  </div>
                </div>

                {/* Standard Block Content */}
                {block.type === 'standard' && (
                  <textarea value={block.content || ''} onChange={(e) => handleUpdateStandardBlock(block.id, 'content', e.target.value)} rows={3} style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '0.95rem', color: currentTheme.textPrimary }} />
                )}

                {/* Container Child Entries */}
                {block.type === 'container' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {(!sortedEntries || sortedEntries.length === 0) && (
                      <div style={{ padding: '1rem', textAlign: 'center', color: currentTheme.textSecondary, border: `1px dashed ${currentTheme.borderColor}`, borderRadius: '4px', fontSize: '0.85rem' }}>
                        Container empty. Click <strong>"➕ Add Item"</strong> to create structured entries.
                      </div>
                    )}

                    {sortedEntries.map((entry, entryIndex) => (
                      <div
                        key={entry.id}
                        draggable
                        onDragStart={() => handleEntryDragStart(block.id, entryIndex)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleEntryDrop(block.id, entryIndex)}
                        style={{
                          padding: '0.85rem',
                          borderRadius: '6px',
                          backgroundColor: currentTheme.bgMain,
                          border: `1px solid ${currentTheme.borderColor}`,
                          opacity: entry.selected ? 1 : 0.6
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                            {/* Child Drag Handle */}
                            <span style={{ cursor: 'grab', color: currentTheme.textSecondary, fontSize: '0.9rem' }} title="Drag item to override position">⋮⋮</span>
                            
                            <input
                              type="checkbox"
                              checked={entry.selected}
                              onChange={() => handleToggleEntrySelection(block.id, entry.id)}
                              style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                              title="Toggle inclusion for targeted resume build"
                            />
                            <input
                              type="text"
                              value={entry.title}
                              onChange={(e) => handleUpdateEntryField(block.id, entry.id, 'title', e.target.value)}
                              placeholder="Degree / Certificate / Role Title"
                              style={{ fontWeight: 'bold', border: 'none', background: 'transparent', flex: 1, fontSize: '0.95rem', color: currentTheme.textPrimary }}
                            />
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                              type="text"
                              value={entry.subtitle || ''}
                              onChange={(e) => handleUpdateEntryField(block.id, entry.id, 'subtitle', e.target.value)}
                              placeholder="Institution / Company"
                              style={{ fontSize: '0.85rem', fontWeight: 'bold', color: currentTheme.accentColor, border: 'none', background: 'transparent', textAlign: 'right' }}
                            />
                            
                            <span style={{ color: currentTheme.textSecondary }}>|</span>

                            {/* Date Period Selector */}
                            <DatePeriodSelector
                              value={entry.datePeriod}
                              theme={currentTheme}
                              onChange={(newPeriod) => {
                                const formatted = `${newPeriod.startMonth} ${newPeriod.startYear} – ${newPeriod.isCurrent ? 'Present' : `${newPeriod.endMonth} ${newPeriod.endYear}`}`;
                                handleUpdateEntryField(block.id, entry.id, 'datePeriod', newPeriod);
                                handleUpdateEntryField(block.id, entry.id, 'dateRange', formatted);
                              }}
                            />

                            <button onClick={() => setExpandedEditor({ type: 'entry', blockId: block.id, entryId: entry.id, title: entry.title, content: entry.content })} style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', borderRadius: '3px', border: `1px solid ${currentTheme.borderColor}`, backgroundColor: currentTheme.bgSurface, color: currentTheme.accentColor, cursor: 'pointer' }}>🔍 Expand</button>
                            <button onClick={() => setDeleteTarget({ type: 'entry', blockId: block.id, entryId: entry.id, title: entry.title })} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem' }}>✕</button>
                          </div>
                        </div>
                        
                        <textarea value={entry.content} onChange={(e) => handleUpdateEntryField(block.id, entry.id, 'content', e.target.value)} rows={2} style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '0.88rem', color: currentTheme.textPrimary }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* EXPANDED WORD PROCESSOR MODAL */}
      {expandedEditor && <WordProcessorModal title={expandedEditor.title} content={expandedEditor.content} theme={currentTheme} onSave={handleSaveExpandedContent} onClose={() => setExpandedEditor(null)} />}

      {/* DATABASE INSPECTOR DRAWER */}
      {showDatabaseDrawer && (
        <DatabaseDrawer
          blocks={blocks}
          profiles={profiles}
          activeProfileId={activeProfileId}
          theme={currentTheme}
          onImportDatabase={(newBlocks) => setBlocks(newBlocks)}
          onClose={() => setShowDatabaseDrawer(false)}
        />
      )}

      {/* CONFIRMATION MODAL */}
      {deleteTarget && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: currentTheme.bgSurface, border: `1px solid ${currentTheme.borderColor}`, borderRadius: '8px', width: '400px', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem' }}>Are you sure you want to delete <strong>"{deleteTarget.title}"</strong>?</div>
            <div style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', backgroundColor: currentTheme.bgMain }}>
              <button onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button onClick={executeDelete} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />);
}