import React from 'react';
import { ResumeBlock } from '../types';

interface BlockCanvasProps {
  blocks: ResumeBlock[];
  onUpdateBlock: (updatedBlock: ResumeBlock) => void;
}

export const BlockCanvas: React.FC<BlockCanvasProps> = ({ blocks, onUpdateBlock }) => {
  return (
    <div style={{ padding: '2rem', backgroundColor: 'var(--bg-surface, #fff)', borderRadius: '8px', border: '1px solid var(--border-color, #e2e8f0)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color, #e2e8f0)', paddingBottom: '0.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Hybrid Block Canvas (SSOT Databank)</h2>
      </div>

      {blocks.map((block) => (
        <div key={block.id} style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px dashed var(--border-color, #e2e8f0)' }}>
          <input
            type="text"
            style={{ width: '100%', fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--accent-color, #2563eb)', border: 'none', background: 'transparent', outline: 'none', marginBottom: '0.5rem' }}
            value={block.title}
            onChange={(e) => onUpdateBlock({ ...block, title: e.target.value })}
          />
          <textarea
            style={{ width: '100%', fontSize: '0.95rem', color: 'var(--text-primary, #0f172a)', border: 'none', background: 'transparent', outline: 'none', resize: 'vertical' }}
            rows={3}
            value={block.content}
            onChange={(e) => onUpdateBlock({ ...block, content: e.target.value })}
          />
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            {block.tags.map((tag) => (
              <span
                key={tag}
                style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem', borderRadius: '3px', backgroundColor: 'var(--bg-main, #f8fafc)', color: 'var(--text-secondary, #475569)', border: '1px solid var(--border-color, #e2e8f0)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
