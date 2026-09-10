import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface WorkExperienceRespListProps {
  responsibilities: string[];
  onChange: (items: string[]) => void;
}

export const WorkExperienceRespList: React.FC<WorkExperienceRespListProps> = ({
  responsibilities,
  onChange,
}) => {
  const [respInput, setRespInput] = useState('');

  const handleAddResp = () => {
    if (respInput.trim()) {
      onChange([...responsibilities, respInput.trim()]);
      setRespInput('');
    }
  };

  const handleRemoveResp = (idx: number) => {
    onChange(responsibilities.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-300 mb-1">Bajarilgan Vazifalar</label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={respInput}
          onChange={(e) => setRespInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddResp();
            }
          }}
          placeholder="Vazifani yozing va Enter bosing..."
          className="flex-1 px-3 py-1.5 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-xs focus:border-blue-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleAddResp}
          className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs cursor-pointer hover:bg-slate-700"
        >
          Qo'shish
        </button>
      </div>
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {responsibilities.map((r, i) => (
          <div key={i} className="flex items-center justify-between p-1.5 rounded bg-slate-950/50 text-xs text-slate-300">
            <span className="flex-1 mr-2">• {r}</span>
            <button
              type="button"
              onClick={() => handleRemoveResp(i)}
              className="text-slate-500 hover:text-rose-400 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
