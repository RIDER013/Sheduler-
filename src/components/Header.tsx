import React from 'react';
import { labels } from '../data/translations';
import { Volume2, VolumeX, Printer, Plus, CalendarCheck } from 'lucide-react';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onAddNewBlock: () => void;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onAddNewBlock,
  onPrint,
}) => {
  return (
    <header className="no-print sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                {labels.appTitle}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline whitespace-nowrap">
                Routine & Time-Block Planner
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#timeline-section" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
              Schedule
            </a>
            <a href="#habits-section" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
              Habits
            </a>
            <a href="#focus-section" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
              Pomodoro
            </a>
            <a href="#notes-section" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
              Notes
            </a>
          </nav>

          {/* Zone 3: Actions & CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Sound toggle */}
            <button
              onClick={onToggleSound}
              type="button"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title={soundEnabled ? labels.soundOn : labels.soundOff}
              aria-label={soundEnabled ? labels.soundOn : labels.soundOff}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Print button */}
            <button
              onClick={onPrint}
              type="button"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors hidden sm:flex items-center gap-1.5 text-xs font-medium"
              title={labels.printSchedule}
              aria-label={labels.printSchedule}
            >
              <Printer className="w-4 h-4" />
              <span className="hidden lg:inline">{labels.printSchedule}</span>
            </button>

            {/* Add Task Primary CTA */}
            <button
              onClick={onAddNewBlock}
              type="button"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{labels.addNewBlock}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
