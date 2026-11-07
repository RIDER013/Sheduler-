import React from 'react';
import { TimeBlock } from '../types';
import { labels } from '../data/translations';
import { formatFriendlyTime, calculateDuration } from '../utils/time';
import { CheckCircle2, Flame } from 'lucide-react';

interface ActiveNowCardProps {
  currentTime: Date;
  activeBlock: TimeBlock | null;
  remainingMinutes: number;
  percentElapsed: number;
  nextBlock: TimeBlock | null;
  onToggleComplete: (id: string) => void;
  streak: number;
}

export const ActiveNowCard: React.FC<ActiveNowCardProps> = ({
  currentTime,
  activeBlock,
  remainingMinutes,
  percentElapsed,
  nextBlock,
  onToggleComplete,
  streak,
}) => {
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const timeString = `${displayHours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds} ${ampm}`;

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80 dark:border-amber-900/50 rounded-2xl p-4 sm:p-6 mb-6 backdrop-blur-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Current Active Task */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span>{labels.activeNow}</span>
            <span className="text-slate-400 dark:text-slate-500">·</span>
            <span className="font-mono tabular-nums text-slate-600 dark:text-slate-300">
              {timeString}
            </span>
          </div>

          {activeBlock ? (
            <div className="space-y-2">
              <div className="flex flex-wrap items-baseline gap-2">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {activeBlock.title}
                </h3>
                {activeBlock.completed && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {labels.completed}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <span className="font-medium text-amber-800 dark:text-amber-300">
                  {formatFriendlyTime(activeBlock.startTime)} – {formatFriendlyTime(activeBlock.endTime)}
                </span>
                <span className="text-slate-400 dark:text-slate-600">·</span>
                <span>{calculateDuration(activeBlock.startTime, activeBlock.endTime)}</span>
                <span className="text-slate-400 dark:text-slate-600">·</span>
                <span className="font-semibold text-amber-700 dark:text-amber-400">
                  {labels.timeRemaining}: {remainingMinutes} {labels.mins}
                </span>
              </div>

              {/* Progress bar of current block */}
              <div className="w-full max-w-md bg-amber-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-amber-500 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${percentElapsed}%` }}
                />
              </div>

              {activeBlock.notes && (
                <p className="text-xs text-slate-600 dark:text-slate-400 italic line-clamp-1">
                  &ldquo;{activeBlock.notes}&rdquo;
                </p>
              )}
            </div>
          ) : (
            <div className="py-1">
              <p className="text-base sm:text-lg font-medium text-slate-700 dark:text-slate-200">
                {labels.noActiveBlock}
              </p>
              {nextBlock ? (
                <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  <span>Upcoming next:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{nextBlock.title}</span>
                  <span>({formatFriendlyTime(nextBlock.startTime)})</span>
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Scroll down to view or customize today’s full routine.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right side: Actions & Streak */}
        <div className="flex sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between sm:justify-end gap-3 shrink-0 pt-2 lg:pt-0 border-t sm:border-t-0 border-amber-200/50">
          {activeBlock && !activeBlock.completed && (
            <button
              onClick={() => onToggleComplete(activeBlock.id)}
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{labels.markDone}</span>
            </button>
          )}

          {/* Daily Streak Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100/80 dark:bg-amber-950/60 rounded-xl border border-amber-300/60 dark:border-amber-800/60">
            <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-amber-500" />
            <span className="text-xs font-bold text-amber-900 dark:text-amber-200 tabular-nums">
              {streak} {labels.streakDays}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
