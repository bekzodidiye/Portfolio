import React, { useState } from 'react';
import { Tag } from 'lucide-react';

interface ProjectTagsInputProps {
  techStack: string[];
  onChange: (tags: string[]) => void;
}

export const ProjectTagsInput: React.FC<ProjectTagsInputProps> = ({
  techStack,
  onChange,
}) => {
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !techStack.includes(trimmed)) {
      onChange([...techStack, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    onChange(techStack.filter((t) => t !== tag));
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
        <Tag className="w-3.5 h-3.5 text-emerald-400" />
        Texnologiyalar Steki (Tech Stack)
      </label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddTag();
            }
          }}
          placeholder="Texnologiya nomi (masalan: Redis, Celery)..."
          className="flex-1 px-3.5 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-xs focus:border-blue-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleAddTag}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition-colors cursor-pointer"
        >
          Qo'shish
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-slate-950/40 rounded-xl border border-slate-800">
        {techStack.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-800/50 text-blue-300 text-xs font-mono"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="text-blue-400 hover:text-rose-400 ml-1 cursor-pointer"
            >
              ×
            </button>
          </span>
        ))}
        {techStack.length === 0 && (
          <span className="text-xs text-slate-500 italic">Hali teglar qo'shilmagan</span>
        )}
      </div>
    </div>
  );
};
