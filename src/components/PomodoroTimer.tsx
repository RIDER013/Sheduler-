import React, { useState, useEffect, useRef } from 'react';
import { labels } from '../data/translations';
import { soundService } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Play, Pause, RotateCcw, Timer, Sparkles } from 'lucide-react';

interface PomodoroTimerProps {
  soundEnabled: boolean;
  focusTaskName: string;
  onClearFocusTask: () => void;
}

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const TIMER_DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  soundEnabled,
  focusTaskName,
  onClearFocusTask,
}) => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(TIMER_DURATIONS.focus);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(TIMER_DURATIONS[newMode]);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsRunning(false);

            if (soundEnabled) {
              soundService.playTimerCompletion();
            }

            try {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
              });
            } catch {
              // ignore
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, soundEnabled]);

  const toggleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_DURATIONS[mode]);
  };

  const displayMinutes = Math.floor(timeLeft / 60);
  const displaySeconds = timeLeft % 60;
  const formattedTime = `${displayMinutes < 10 ? '0' : ''}${displayMinutes}:${
    displaySeconds < 10 ? '0' : ''
  }${displaySeconds}`;

  return (
    <div id="focus-section" className="no-print bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 mb-6 shadow-xs">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {labels.focusTimerTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              25m uninterrupted deep work sprints & 5m breaks
            </p>
          </div>
        </div>

        {/* Mode switcher tabs */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium">
          <button
            onClick={() => switchMode('focus')}
            type="button"
            className={`px-3 py-1.5 rounded-lg transition-all ${
              mode === 'focus'
                ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {labels.focusMode}
          </button>
          <button
            onClick={() => switchMode('shortBreak')}
            type="button"
            className={`px-3 py-1.5 rounded-lg transition-all ${
              mode === 'shortBreak'
                ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {labels.shortBreak}
          </button>
          <button
            onClick={() => switchMode('longBreak')}
            type="button"
            className={`px-3 py-1.5 rounded-lg transition-all hidden sm:block ${
              mode === 'longBreak'
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {labels.longBreak}
          </button>
        </div>
      </div>

      {/* Focus Task Target */}
      {focusTaskName && (
        <div className="flex items-center justify-between p-2.5 mb-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs">
          <div className="flex items-center gap-2 truncate text-amber-900 dark:text-amber-200">
            <Sparkles className="w-4 h-4 shrink-0 text-amber-600" />
            <span className="font-medium">Current focus:</span>
            <span className="font-bold truncate">{focusTaskName}</span>
          </div>
          <button
            onClick={onClearFocusTask}
            type="button"
            className="text-amber-700 dark:text-amber-400 hover:underline text-[11px] shrink-0 ml-2"
          >
            Clear
          </button>
        </div>
      )}

      {/* Timer Display and Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            {formattedTime}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-[130px]">
            {isRunning
              ? 'Sprint in progress... stay focused'
              : timeLeft === 0
              ? labels.timerCompletedMsg
              : 'Ready to begin your session'}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleStartPause}
            type="button"
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-xs transition-colors ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>{labels.pause}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{labels.start}</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{labels.reset}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
