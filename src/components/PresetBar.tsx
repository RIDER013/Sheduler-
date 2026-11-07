import React from 'react';
import { PresetKey } from '../types';
import { labels } from '../data/translations';
import { GraduationCap, Briefcase, Dumbbell, Laptop, FileText } from 'lucide-react';

interface PresetBarProps {
  selectedPreset: PresetKey;
  onSelectPreset: (preset: PresetKey) => void;
}

export const PresetBar: React.FC<PresetBarProps> = ({
  selectedPreset,
  onSelectPreset,
}) => {
  const presetsList: { id: PresetKey; name: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'student',
      name: labels.presets.student,
      desc: labels.presets.studentDesc,
      icon: <GraduationCap className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'office',
      name: labels.presets.office,
      desc: labels.presets.officeDesc,
      icon: <Briefcase className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'fitness',
      name: labels.presets.fitness,
      desc: labels.presets.fitnessDesc,
      icon: <Dumbbell className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'freelancer',
      name: labels.presets.freelancer,
      desc: labels.presets.freelancerDesc,
      icon: <Laptop className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'blank',
      name: labels.presets.blank,
      desc: labels.presets.blankDesc,
      icon: <FileText className="w-4 h-4 shrink-0" />,
    },
  ];

  return (
    <div className="no-print mb-6">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {labels.presetLabel}
        </label>
        <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline">
          Pick a template and customize anytime
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {presetsList.map((p) => {
          const isSelected = selectedPreset === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onSelectPreset(p.id)}
              type="button"
              className={`flex items-center gap-2 p-2.5 text-left rounded-xl border text-xs font-medium transition-all ${
                isSelected
                  ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/40 text-amber-900 dark:text-amber-100 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <span className={isSelected ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500'}>
                {p.icon}
              </span>
              <span className="truncate">{p.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
