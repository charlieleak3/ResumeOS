import React from 'react';
import { ResumeBlock } from '../../shared/types';

interface BlockCanvasProps {
  blocks: ResumeBlock[];
  onUpdateBlock: (updatedBlock: ResumeBlock) => void;
}

export const BlockCanvas: React.FC<BlockCanvasProps> = ({ blocks, onUpdateBlock }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)] shadow-sm rounded-lg transition-colors duration-200">
      {blocks.map((block) => (
        <div key={block.id} className="mb-6 group relative border-b border-[var(--border-color)] pb-4">
          <input
            type="text"
            className="text-lg font-bold w-full bg-transparent outline-none text-[var(--accent-color)]"
            value={block.title}
            onChange={(e) => onUpdateBlock({ ...block, title: e.target.value })}
          />
          <textarea
            className="w-full mt-2 bg-transparent outline-none resize-none text-[var(--text-primary)]"
            rows={3}
            value={block.content}
            onChange={(e) => onUpdateBlock({ ...block, content: e.target.value })}
          />
          <div className="flex gap-2 mt-2">
            {block.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded bg-[var(--bg-main)] text-[var(--text-secondary)] border border-[var(--border-color)]"
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