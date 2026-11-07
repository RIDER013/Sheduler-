import React, { useState } from 'react';
import { DailyPriority } from '../types';
import { labels } from '../data/translations';
import { Target, CheckCircle2, Circle, Plus, Trash2, FileText } from 'lucide-react';

interface PrioritiesAndNotesProps {
  priorities: DailyPriority[];
  notes: string;
  onTogglePriority: (id: string) => void;
  onAddPriority: (text: string) => void;
  onDeletePriority: (id: string) => void;
  onChangeNotes: (notes: string) => void;
}

export const PrioritiesAndNotes: React.FC<PrioritiesAndNotesProps> = ({
  priorities,
  notes,
  onTogglePriority,
  onAddPriority,
  onDeletePriority,
  onChangeNotes,
}) => {
  const [newText, setNewText] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    onAddPriority(newText.trim());
    setNewText('');
    setShowInput(false);
  };

  return (
    <div id="notes-section" className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Top 3 Priorities */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {labels.prioritiesTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {labels.prioritiesSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowInput(!showInput)}
            type="button"
            className="no-print inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200 dark:border-rose-900/50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{labels.addPriority}</span>
          </button>
        </div>

        {/* Input */}
        {showInput && (
          <form onSubmit={handleAdd} className="no-print flex gap-2 mb-3">
            <input
              type="text"
              autoFocus
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="e.g. Finish client presentation draft..."
              className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
            >
              {labels.save}
            </button>
          </form>
        )}

        {/* Priorities list */}
        <div className="space-y-2 flex-1">
          {priorities.map((item, idx) => (
            <div
              key={item.id}
              className={`flex items-start justify-between gap-2.5 p-3 rounded-xl border transition-all ${
                item.completed
                  ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs'
              }`}
            >
              <button
                onClick={() => onTogglePriority(item.id)}
                type="button"
                className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors shrink-0"
              >
                {item.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </button>

              <span
                className={`flex-1 text-xs sm:text-sm font-medium leading-snug ${
                  item.completed
                    ? 'line-through text-slate-400 dark:text-slate-500'
                    : 'text-slate-800 dark:text-slate-200'
                }`}
              >
                <span className="font-mono text-slate-400 mr-1.5">#{idx + 1}</span>
                {item.text}
              </span>

              <button
                onClick={() => onDeletePriority(item.id)}
                type="button"
                className="no-print p-1 text-slate-300 hover:text-rose-500 rounded shrink-0"
                title={labels.deleteBlock}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {priorities.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-4">
              No daily priorities set yet. Add up to 3 core goals!
            </p>
          )}
        </div>
      </div>

      {/* Daily Notes & Reflections */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {labels.notesTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personal reflections, learnings & tomorrow’s setup
            </p>
          </div>
        </div>

        <textarea
          rows={5}
          value={notes}
          onChange={(e) => onChangeNotes(e.target.value)}
          placeholder={labels.dailyNotesPlaceholder}
          className="flex-1 w-full p-3.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed resize-none"
        />
        <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2">
          <span>✓ Autosaved locally</span>
          <span className="font-mono">{notes.length} chars</span>
        </div>
      </div>
    </div>
  );
};
