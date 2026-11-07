import React from 'react';
import { TimeBlock, Habit } from '../types';
import { labels } from '../data/translations';
import { timeToMinutes } from '../utils/time';
import { CheckCircle2, ListTodo, Clock4, Award, RotateCcw } from 'lucide-react';

interface DailyStatsStripProps {
  blocks: TimeBlock[];
  habits: Habit[];
  onResetDay: () => void;
}

export const DailyStatsStrip: React.FC<DailyStatsStripProps> = ({
  blocks,
  habits,
  onResetDay,
}) => {
  const totalBlocks = blocks.length;
  const completedBlocks = blocks.filter((b) => b.completed).length;
  const blockPercent = totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0;

  // Calculate total scheduled minutes
  const totalMinutes = blocks.reduce((acc, b) => {
    const s = timeToMinutes(b.startTime);
    let e = timeToMinutes(b.endTime);
    if (e < s) e += 24 * 60;
    return acc + Math.max(0, e - s);
  }, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  // Habits completed
  const completedHabits = habits.filter((h) => h.completed || h.currentCount >= h.targetCount).length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 mb-6 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
            {labels.progress}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {blockPercent === 100
              ? labels.allTasksDone
              : `${completedBlocks} of ${totalBlocks} schedule blocks completed.`}
          </p>
        </div>

        {/* Reset Day button */}
        <button
          onClick={onResetDay}
          type="button"
          className="no-print inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
          title={labels.confirmResetDay}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{labels.resetDayBtn}</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mb-5">
        <div
          className="bg-emerald-500 h-full transition-all duration-700 rounded-full"
          style={{ width: `${blockPercent}%` }}
        />
      </div>

      {/* 4-Item Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <ListTodo className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Scheduled Tasks
            </div>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {totalBlocks}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Completed Tasks
            </div>
            <div className="text-lg font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              {completedBlocks} <span className="text-xs text-slate-400 font-normal">({blockPercent}%)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <Clock4 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Scheduled Hours
            </div>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {totalHours} <span className="text-xs text-slate-400 font-normal">{labels.hrs}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Habits Completed
            </div>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {completedHabits}/{habits.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
