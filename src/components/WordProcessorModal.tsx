import React, { useState, useRef } from 'react';

interface WordProcessorModalProps {
  title: string;
  content: string;
  theme: any;
  onSave: (newTitle: string, newContent: string) => void;
  onClose: () => void;
}

export const WordProcessorModal: React.FC<WordProcessorModalProps> = ({
  title,
  content,
  theme,
  onSave,
  onClose,
}) => {
  const [currentTitle, setCurrentTitle] = useState(title);
  const [currentContent, setCurrentContent] = useState(content);
  const [bulletMode, setBulletMode] = useState<boolean>(true);

  const [fontFamily, setFontFamily] = useState<'serif' | 'sans-serif' | 'monospace'>('sans-serif');
  const [fontSize, setFontSize] = useState<string>('1rem');
  const [lineHeight, setLineHeight] = useState<string>('1.6');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'justify'>('left');

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const wordCount = currentContent.trim() ? currentContent.trim().split(/\s+/).length : 0;
  const charCount = currentContent.length;

  const wrapSelectedText = (prefix: string, suffix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = currentContent.substring(start, end);

    const replacement = `${prefix}${selected}${suffix}`;
    const updated = currentContent.substring(0, start) + replacement + currentContent.substring(end);
    
    setCurrentContent(updated);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleApplyBullet = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start !== end) {
      const before = currentContent.substring(0, start);
      const selection = currentContent.substring(start, end);
      const after = currentContent.substring(end);

      const bulletedLines = selection
        .split('\n')
        .map(line => /^\s*[•\-\*]\s*/.test(line) ? line : `• ${line}`)
        .join('\n');

      setCurrentContent(before + bulletedLines + after);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start + bulletedLines.length);
      }, 0);
    } else {
      const beforeCursor = currentContent.substring(0, start);
      const lastNewlineIndex = beforeCursor.lastIndexOf('\n');
      const lineStartPos = lastNewlineIndex === -1 ? 0 : lastNewlineIndex + 1;

      const lineBeforeCursor = currentContent.substring(lineStartPos, start);
      if (/^\s*[•\-\*]\s*/.test(lineBeforeCursor)) return;

      const updated = currentContent.substring(0, lineStartPos) + '• ' + currentContent.substring(lineStartPos);
      setCurrentContent(updated);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 2, start + 2);
      }, 0);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setCurrentContent(prev => prev ? `${prev}\n${text}` : text);
      }
    } catch (err) {
      alert("Clipboard permission unavailable. Use Ctrl+V / Cmd+V to paste manually.");
    }
  };

  const handleCleanPastedText = () => {
    const cleaned = currentContent
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    setCurrentContent(cleaned);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onSave(currentTitle, currentContent);
      return;
    }

    if (e.key === 'Enter' && bulletMode) {
      const target = e.currentTarget;
      const selectionStart = target.selectionStart;
      const selectionEnd = target.selectionEnd;

      const textBeforeCursor = currentContent.substring(0, selectionStart);
      const lines = textBeforeCursor.split('\n');
      const currentLine = lines[lines.length - 1];

      const hasBullet = /^\s*[•\-\*]\s*/.test(currentLine);

      if (hasBullet || bulletMode) {
        if (currentLine.trim() === '•' || currentLine.trim() === '-' || currentLine.trim() === '*') {
          e.preventDefault();
          const lineStartPos = selectionStart - currentLine.length;
          const updatedText = currentContent.substring(0, lineStartPos) + currentContent.substring(selectionEnd);
          setCurrentContent(updatedText);
          return;
        }

        e.preventDefault();
        const bulletPrefix = '\n• ';
        const updatedText = currentContent.substring(0, selectionStart) + bulletPrefix + currentContent.substring(selectionEnd);
        setCurrentContent(updatedText);

        setTimeout(() => {
          target.selectionStart = target.selectionEnd = selectionStart + bulletPrefix.length;
        }, 0);
      }
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <div style={{ backgroundColor: theme.bgSurface, border: `1px solid ${theme.borderColor}`, borderRadius: '10px', width: '920px', maxWidth: '95vw', height: '88vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ padding: '0.75rem 1.25rem', backgroundColor: theme.bgMain, borderBottom: `1px solid ${theme.borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
            <span style={{ fontSize: '1.2rem' }}>📝</span>
            <input
              type="text"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              style={{ fontSize: '1.1rem', fontWeight: 'bold', color: theme.accentColor, border: 'none', background: 'transparent', outline: 'none', width: '80%' }}
              placeholder="Title..."
            />
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textSecondary, fontSize: '1.2rem', fontWeight: 'bold' }}>✕</button>
        </div>

        {/* Toolbar */}
        <div style={{ padding: '0.5rem 1.25rem', borderBottom: `1px solid ${theme.borderColor}`, backgroundColor: theme.bgSurface, display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button onClick={handlePasteFromClipboard} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', borderRadius: '4px', border: `1px solid ${theme.accentColor}`, backgroundColor: theme.bgMain, color: theme.accentColor, fontWeight: 'bold', cursor: 'pointer' }}>
            📋 Paste Clipboard
          </button>
          <button onClick={handleCleanPastedText} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', borderRadius: '4px', border: `1px solid ${theme.borderColor}`, backgroundColor: theme.bgMain, color: theme.textPrimary, cursor: 'pointer' }} title="Remove extra whitespace from PDF/Word pastes">
            🧹 Clean Text
          </button>

          <span style={{ color: theme.borderColor }}>|</span>

          <button
            onClick={() => setBulletMode(!bulletMode)}
            style={{
              padding: '0.25rem 0.6rem',
              fontSize: '0.8rem',
              borderRadius: '4px',
              border: `1px solid ${bulletMode ? theme.accentColor : theme.borderColor}`,
              backgroundColor: bulletMode ? theme.accentColor : theme.bgMain,
              color: bulletMode ? '#fff' : theme.textPrimary,
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
            title="Auto-continue bullets when pressing Enter"
          >
            • Auto-Enter Bullet: {bulletMode ? 'ON' : 'OFF'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ fontSize: '0.75rem', color: theme.textSecondary }}>Font:</span>
            <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value as any)} style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', border: `1px solid ${theme.borderColor}`, backgroundColor: theme.bgMain, color: theme.textPrimary, fontSize: '0.8rem' }}>
              <option value="sans-serif">Sans-Serif (Modern)</option>
              <option value="serif">Serif (Executive)</option>
              <option value="monospace">Monospace (Technical)</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ fontSize: '0.75rem', color: theme.textSecondary }}>Size:</span>
            <select value={fontSize} onChange={(e) => setFontSize(e.target.value)} style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', border: `1px solid ${theme.borderColor}`, backgroundColor: theme.bgMain, color: theme.textPrimary, fontSize: '0.8rem' }}>
              <option value="0.85rem">Small (12px)</option>
              <option value="1rem">Normal (14px)</option>
              <option value="1.15rem">Large (16px)</option>
              <option value="1.3rem">Heading (18px)</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.3rem', marginLeft: 'auto' }}>
            <button onClick={() => wrapSelectedText('**', '**')} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', borderRadius: '4px', border: `1px solid ${theme.borderColor}`, background: theme.bgMain, color: theme.textPrimary, fontWeight: 'bold', cursor: 'pointer' }}>B</button>
            <button onClick={() => wrapSelectedText('*', '*')} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', borderRadius: '4px', border: `1px solid ${theme.borderColor}`, background: theme.bgMain, color: theme.textPrimary, fontStyle: 'italic', cursor: 'pointer' }}>I</button>
            <button
              onClick={handleApplyBullet}
              style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', borderRadius: '4px', border: `1px solid ${theme.borderColor}`, background: theme.bgMain, color: theme.accentColor, fontWeight: 'bold', cursor: 'pointer' }}
              title="Prefix current line or selection with bullet points"
            >
              • Bullet Line
            </button>
          </div>
        </div>

        {/* Textarea */}
        <div style={{ flex: 1, padding: '1.5rem', backgroundColor: theme.bgSurface }}>
          <textarea
            ref={textareaRef}
            value={currentContent}
            onChange={(e) => setCurrentContent(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ width: '100%', height: '100%', border: 'none', outline: 'none', fontSize, lineHeight, textAlign, fontFamily, color: theme.textPrimary, background: 'transparent', resize: 'none' }}
            placeholder="Type your content..."
            autoFocus
          />
        </div>

        {/* Footer */}
        <div style={{ padding: '0.75rem 1.25rem', backgroundColor: theme.bgMain, borderTop: `1px solid ${theme.borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: theme.textSecondary }}>Words: <strong>{wordCount}</strong> | Characters: <strong>{charCount}</strong> (Press <code>Ctrl+Enter</code> to save)</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={onClose} style={{ padding: '0.4rem 1rem', borderRadius: '4px', border: `1px solid ${theme.borderColor}`, backgroundColor: theme.bgSurface, color: theme.textPrimary, cursor: 'pointer' }}>Cancel</button>
            <button onClick={() => onSave(currentTitle, currentContent)} style={{ padding: '0.4rem 1.2rem', borderRadius: '4px', border: 'none', backgroundColor: theme.accentColor, color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Save Changes</button>
          </div>
        </div>

      </div>
    </div>
  );
};