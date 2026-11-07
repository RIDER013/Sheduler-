import React, { useState } from 'react';
import { Habit } from '../types';
import { labels } from '../data/translations';
import {
  Droplet,
  Activity,
  BookOpen,
  Sun,
  Moon,
  Plus,
  Trash2,
  Check,
  Sparkles,
} from 'lucide-react';

interface HabitsTrackerProps {
  habits: Habit[];
  onUpdateCount: (id: string, delta: number) => void;
  onToggleHabit: (id: string) => void;
  onAddHabit: (habit: Omit<Habit, 'id' | 'completed'>) => void;
  onDeleteHabit: (id: string) => void;
}

export const HabitsTracker: React.FC<HabitsTrackerProps> = ({
  habits,
  onUpdateCount,
  onToggleHabit,
  onAddHabit,
  onDeleteHabit,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState(1);
  const [newUnit, setNewUnit] = useState('session');

  const getHabitIcon = (iconName: string) => {
    switch (iconName) {
      case 'droplet':
        return <Droplet className="w-4 h-4 text-sky-500" />;
      case 'activity':
        return <Activity className="w-4 h-4 text-emerald-500" />;
      case 'book-open':
        return <BookOpen className="w-4 h-4 text-indigo-500" />;
      case 'sun':
        return <Sun className="w-4 h-4 text-amber-500" />;
      case 'moon':
        return <Moon className="w-4 h-4 text-purple-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-500" />;
    }
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddHabit({
      title: newTitle.trim(),
      targetCount: Math.max(1, newTarget),
      currentCount: 0,
      unit: newUnit.trim() || 'session',
      iconName: 'sparkles',
    });
    setNewTitle('');
    setNewTarget(1);
    setShowAddForm(false);
  };

  return (
    <div id="habits-section" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 mb-6 shadow-xs">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{labels.habitsTitle}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {labels.habitsSubtitle}
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          type="button"
          className="no-print inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 rounded-lg transition-colors border border-amber-200 dark:border-amber-900/50"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{labels.addHabit}</span>
        </button>
      </div>

      {/* Add Habit Quick Form */}
      {showAddForm && (
        <form onSubmit={handleCreateHabit} className="no-print p-3.5 mb-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <input
              type="text"
              required
              placeholder="Habit name (e.g. 10 Pushups, Green Tea)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 sm:col-span-1"
            />
            <input
              type="number"
              min={1}
              max={50}
              placeholder="Target count (e.g. 5)"
              value={newTarget}
              onChange={(e) => setNewTarget(parseInt(e.target.value, 10) || 1)}
              className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <input
              type="text"
              placeholder="Unit (e.g. glasses, mins, sets)"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900"
            >
              {labels.cancel}
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
            >
              {labels.save}
            </button>
          </div>
        </form>
      )}

      {/* Habit Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {habits.map((habit) => {
          const isDone = habit.completed || habit.currentCount >= habit.targetCount;

          return (
            <div
              key={habit.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                isDone
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-2xs shrink-0">
                  {getHabitIcon(habit.iconName)}
                </div>
                <div className="min-w-0">
                  <h4
                    className={`text-xs font-semibold truncate ${
                      isDone
                        ? 'text-slate-700 dark:text-slate-300'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {habit.title}
                  </h4>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                    {habit.currentCount} / {habit.targetCount} {habit.unit}
                  </div>
                </div>
              </div>

              {/* Counters or Checkbox */}
              <div className="flex items-center gap-1 shrink-0">
                {habit.targetCount > 1 ? (
                  <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-0.5">
                    <button
                      onClick={() => onUpdateCount(habit.id, -1)}
                      disabled={habit.currentCount <= 0}
                      type="button"
                      className="w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-xs font-semibold font-mono tabular-nums text-slate-800 dark:text-slate-200">
                      {habit.currentCount}
                    </span>
                    <button
                      onClick={() => onUpdateCount(habit.id, 1)}
                      disabled={habit.currentCount >= habit.targetCount}
                      type="button"
                      className="w-6 h-6 flex items-center justify-center text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onToggleHabit(habit.id)}
                    type="button"
                    className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:border-amber-500 text-transparent'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                )}

                {/* Delete button (for custom habits) */}
                {habit.id.startsWith('custom-') && (
                  <button
                    onClick={() => onDeleteHabit(habit.id)}
                    type="button"
                    className="no-print p-1 text-slate-400 hover:text-rose-500"
                    title={labels.deleteBlock}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
