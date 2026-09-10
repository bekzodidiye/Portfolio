import React, { useState } from 'react';
import { Sparkles, Trash2 } from 'lucide-react';

interface ProjectFeaturesInputProps {
  keyFeatures: string[];
  onChange: (features: string[]) => void;
}

export const ProjectFeaturesInput: React.FC<ProjectFeaturesInputProps> = ({
  keyFeatures,
  onChange,
}) => {
  const [featureInput, setFeatureInput] = useState('');

  const handleAddFeature = () => {
    const trimmed = featureInput.trim();
    if (trimmed) {
      onChange([...keyFeatures, trimmed]);
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    onChange(keyFeatures.filter((_, idx) => idx !== index));
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        Asosiy Imkoniyatlar (Key Features)
      </label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={featureInput}
          onChange={(e) => setFeatureInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddFeature();
            }
          }}
          placeholder="Imkoniyat yozing va Enter bosing..."
          className="flex-1 px-3.5 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-xs focus:border-blue-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleAddFeature}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition-colors cursor-pointer"
        >
          Qo'shish
        </button>
      </div>

      <div className="space-y-1.5 max-h-36 overflow-y-auto">
        {keyFeatures.map((feat, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300"
          >
            <span className="flex-1 mr-2">• {feat}</span>
            <button
              type="button"
              onClick={() => handleRemoveFeature(idx)}
              className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
