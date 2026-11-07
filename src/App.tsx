import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  TimeBlock,
  Habit,
  DailyPriority,
  PresetKey,
  DailyScheduleState,
} from './types';
import { labels } from './data/translations';
import { PRESET_SCHEDULES, DEFAULT_HABITS, DEFAULT_PRIORITIES, DEFAULT_DIAL_PINS, DEFAULT_DIAL_STYLE } from './data/presets';
import { DialStudio } from './components/DialStudio';
import { DialPin, DialStyleConfig } from './types';
import {
  findActiveBlock,
  formatCurrentDate,
  timeToMinutes,
} from './utils/time';
import { soundService } from './utils/audio';
import confetti from 'canvas-confetti';

// Components
import { Header } from './components/Header';
import { ActiveNowCard } from './components/ActiveNowCard';
import { DailyStatsStrip } from './components/DailyStatsStrip';
import { PresetBar } from './components/PresetBar';
import { TimeBlockCard } from './components/TimeBlockCard';
import { BlockModal } from './components/BlockModal';
import { HabitsTracker } from './components/HabitsTracker';
import { PomodoroTimer } from './components/PomodoroTimer';
import { PrioritiesAndNotes } from './components/PrioritiesAndNotes';
import { PrintableView } from './components/PrintableView';

import {
  Search,
  Plus,
  Download,
  Upload,
  Calendar,
  AlertCircle,
} from 'lucide-react';

const STORAGE_KEY = 'daily_scheduler_en_v1';

export default function App() {
  // Sound enabled
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('daily_scheduler_sound');
    return saved !== null ? saved === 'true' : true;
  });

  // Current live time
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Main schedule state in English
  const [state, setState] = useState<DailyScheduleState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.blocks && Array.isArray(parsed.blocks) && parsed.blocks.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    return {
      date: todayStr,
      streak: 3,
      lastActiveDate: todayStr,
      blocks: PRESET_SCHEDULES.student,
      habits: DEFAULT_HABITS,
      priorities: DEFAULT_PRIORITIES,
      notes: '',
      selectedPreset: 'student',
      soundEnabled: true,
      dialPins: DEFAULT_DIAL_PINS,
      dialStyle: DEFAULT_DIAL_STYLE,
    };
  });

  const handleUpdateDialPins = (pins: DialPin[]) => {
    setState((prev) => ({ ...prev, dialPins: pins }));
  };

  const handleUpdateDialStyle = (style: DialStyleConfig) => {
    setState((prev) => ({ ...prev, dialStyle: style }));
  };

  // Active / Upcoming block calculation
  const { active: activeBlock, remainingMinutes, percentElapsed } = useMemo(
    () => findActiveBlock(state.blocks, currentTime),
    [state.blocks, currentTime]
  );

  const nextBlock = useMemo(() => {
    const currentMins = currentTime.getHours() * 60 + currentTime.getMinutes();
    const sorted = [...state.blocks].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
    return sorted.find((b) => timeToMinutes(b.startTime) > currentMins && !b.completed) || null;
  }, [state.blocks, currentTime]);

  // Filtering states
  type PeriodFilter = 'all' | 'morning' | 'afternoon' | 'eveningNight';
  type StatusFilter = 'all' | 'pending' | 'completed';

  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<TimeBlock | null>(null);

  // Focus Pomodoro task name
  const [focusTaskName, setFocusTaskName] = useState<string>('');

  // Hidden file input for backup restore
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live timer tick every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [state]);

  // Save sound preference
  useEffect(() => {
    localStorage.setItem('daily_scheduler_sound', String(soundEnabled));
  }, [soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  // Block handlers
  const handleToggleBlockComplete = (id: string) => {
    setState((prev) => {
      let isNewlyCompleted = false;
      const updated = prev.blocks.map((b) => {
        if (b.id === id) {
          const nextVal = !b.completed;
          if (nextVal) isNewlyCompleted = true;
          return { ...b, completed: nextVal };
        }
        return b;
      });

      if (isNewlyCompleted) {
        if (soundEnabled) soundService.playDing();
        // Check if all are now completed
        const allDone = updated.length > 0 && updated.every((b) => b.completed);
        if (allDone) {
          try {
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.5 },
            });
          } catch {
            // ignore
          }
        }
      }

      return { ...prev, blocks: updated };
    });
  };

  const handleSaveBlock = (
    data: Omit<TimeBlock, 'id' | 'completed'> & { id?: string }
  ) => {
    setState((prev) => {
      if (data.id) {
        // Edit existing
        const updated = prev.blocks.map((b) =>
          b.id === data.id
            ? {
                ...b,
                title: data.title,
                startTime: data.startTime,
                endTime: data.endTime,
                category: data.category,
                priority: data.priority,
                notes: data.notes,
              }
            : b
        );
        return { ...prev, blocks: updated };
      } else {
        // Add new
        const newBlock: TimeBlock = {
          id: `block-${Date.now()}`,
          title: data.title,
          startTime: data.startTime,
          endTime: data.endTime,
          category: data.category,
          priority: data.priority,
          notes: data.notes,
          completed: false,
        };
        const combined = [...prev.blocks, newBlock].sort(
          (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
        );
        return { ...prev, blocks: combined };
      }
    });
  };

  const handleDeleteBlock = (id: string) => {
    if (window.confirm(labels.confirmDelete)) {
      setState((prev) => ({
        ...prev,
        blocks: prev.blocks.filter((b) => b.id !== id),
      }));
    }
  };

  const handleDuplicateBlock = (block: TimeBlock) => {
    const newBlock: TimeBlock = {
      ...block,
      id: `block-${Date.now()}`,
      title: `${block.title} (Copy)`,
      completed: false,
    };
    setState((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock].sort(
        (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
      ),
    }));
  };

  const handleMoveBlock = (id: string, direction: 'up' | 'down') => {
    setState((prev) => {
      const idx = prev.blocks.findIndex((b) => b.id === id);
      if (idx === -1) return prev;
      if (direction === 'up' && idx === 0) return prev;
      if (direction === 'down' && idx === prev.blocks.length - 1) return prev;

      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      const copy = [...prev.blocks];
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;

      return { ...prev, blocks: copy };
    });
  };

  // Preset switch
  const handleSelectPreset = (preset: PresetKey) => {
    if (window.confirm(labels.confirmPreset)) {
      setState((prev) => ({
        ...prev,
        selectedPreset: preset,
        blocks: PRESET_SCHEDULES[preset] || [],
      }));
    }
  };

  // Reset day
  const handleResetDay = () => {
    if (window.confirm(labels.confirmResetDay)) {
      setState((prev) => ({
        ...prev,
        blocks: prev.blocks.map((b) => ({ ...b, completed: false })),
        habits: prev.habits.map((h) => ({ ...h, currentCount: 0, completed: false })),
        priorities: prev.priorities.map((p) => ({ ...p, completed: false })),
      }));
    }
  };

  // Habits
  const handleUpdateHabitCount = (id: string, delta: number) => {
    setState((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => {
        if (h.id === id) {
          const nextCount = Math.max(0, Math.min(h.targetCount, h.currentCount + delta));
          const completed = nextCount >= h.targetCount;
          if (completed && !h.completed && soundEnabled) {
            soundService.playDing();
          }
          return { ...h, currentCount: nextCount, completed };
        }
        return h;
      }),
    }));
  };

  const handleToggleHabit = (id: string) => {
    setState((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => {
        if (h.id === id) {
          const completed = !h.completed;
          if (completed && soundEnabled) soundService.playDing();
          return {
            ...h,
            completed,
            currentCount: completed ? h.targetCount : 0,
          };
        }
        return h;
      }),
    }));
  };

  const handleAddHabit = (newHabit: Omit<Habit, 'id' | 'completed'>) => {
    const habit: Habit = {
      ...newHabit,
      id: `custom-habit-${Date.now()}`,
      completed: false,
    };
    setState((prev) => ({
      ...prev,
      habits: [...prev.habits, habit],
    }));
  };

  const handleDeleteHabit = (id: string) => {
    setState((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== id),
    }));
  };

  // Priorities
  const handleTogglePriority = (id: string) => {
    setState((prev) => ({
      ...prev,
      priorities: prev.priorities.map((p) => {
        if (p.id === id) {
          const completed = !p.completed;
          if (completed && soundEnabled) soundService.playDing();
          return { ...p, completed };
        }
        return p;
      }),
    }));
  };

  const handleAddPriority = (text: string) => {
    const newItem: DailyPriority = {
      id: `p-${Date.now()}`,
      text,
      completed: false,
    };
    setState((prev) => ({
      ...prev,
      priorities: [...prev.priorities, newItem],
    }));
  };

  const handleDeletePriority = (id: string) => {
    setState((prev) => ({
      ...prev,
      priorities: prev.priorities.filter((p) => p.id !== id),
    }));
  };

  // Notes
  const handleChangeNotes = (newNotes: string) => {
    setState((prev) => ({ ...prev, notes: newNotes }));
  };

  // Start Pomodoro Focus with a task name
  const handleStartFocusTask = (taskName: string) => {
    setFocusTaskName(taskName);
    const element = document.getElementById('focus-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `daily_schedule_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && Array.isArray(parsed.blocks)) {
            setState(parsed);
            alert('Backup restored successfully!');
          }
        } catch {
          alert('Failed to parse backup file');
        }
      };
    }
  };

  // Filtered blocks list
  const filteredBlocks = useMemo(() => {
    return state.blocks.filter((b) => {
      // Query search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = b.title.toLowerCase().includes(q);
        const matchesNotes = b.notes?.toLowerCase().includes(q);
        const matchesCat = labels.categories[b.category]?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesNotes && !matchesCat) return false;
      }

      // Status filter
      if (statusFilter === 'pending' && b.completed) return false;
      if (statusFilter === 'completed' && !b.completed) return false;

      // Period filter
      if (periodFilter !== 'all') {
        const startMins = timeToMinutes(b.startTime);
        if (periodFilter === 'morning') {
          if (startMins < 300 || startMins >= 720) return false;
        } else if (periodFilter === 'afternoon') {
          if (startMins < 720 || startMins >= 1020) return false;
        } else if (periodFilter === 'eveningNight') {
          if (startMins >= 300 && startMins < 1020) return false;
        }
      }

      return true;
    });
  }, [state.blocks, searchQuery, statusFilter, periodFilter]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-amber-100 selection:text-amber-900 transition-colors">
      {/* Top Bar */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onAddNewBlock={() => {
          setEditingBlock(null);
          setIsModalOpen(true);
        }}
        onPrint={() => window.print()}
      />

      {/* Main Content Viewport */}
      <main className="no-print flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Date and Welcoming Kicker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-400">
              <Calendar className="w-4 h-4" />
              <span>{labels.todayIs}:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {formatCurrentDate(currentTime)}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Daily Routine & Time-Block Planner
            </h1>
          </div>

          {/* Quick Backup Actions */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleExportBackup}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              title={labels.backupExport}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{labels.backupExport}</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              title={labels.backupImport}
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{labels.backupImport}</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportBackup}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>

        {/* Hero Active Task Card */}
        <ActiveNowCard
          currentTime={currentTime}
          activeBlock={activeBlock}
          remainingMinutes={remainingMinutes}
          percentElapsed={percentElapsed}
          nextBlock={nextBlock}
          onToggleComplete={handleToggleBlockComplete}
          streak={state.streak}
        />

        {/* Daily Progress & Metrics Strip */}
        <DailyStatsStrip
          blocks={state.blocks}
          habits={state.habits}
          onResetDay={handleResetDay}
        />

        {/* Presets Switcher Bar */}
        <PresetBar
          selectedPreset={state.selectedPreset}
          onSelectPreset={handleSelectPreset}
        />

        {/* Custom Watch / Routine Dial Studio */}
        <DialStudio
          pins={state.dialPins}
          styleConfig={state.dialStyle}
          onUpdatePins={handleUpdateDialPins}
          onUpdateStyle={handleUpdateDialStyle}
        />

        {/* Schedule Timeline Section */}
        <div id="timeline-section" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 mb-8 shadow-xs">
          {/* Timeline Toolbar: Title, Filter Tabs & Search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Daily Schedule Timeline
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Check off tasks as your day progresses and keep your momentum going
              </p>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Period Filter */}
              <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setPeriodFilter('all')}
                  className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap ${
                    periodFilter === 'all'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {labels.all}
                </button>
                <button
                  type="button"
                  onClick={() => setPeriodFilter('morning')}
                  className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap ${
                    periodFilter === 'morning'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Morning
                </button>
                <button
                  type="button"
                  onClick={() => setPeriodFilter('afternoon')}
                  className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap ${
                    periodFilter === 'afternoon'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Afternoon
                </button>
                <button
                  type="button"
                  onClick={() => setPeriodFilter('eveningNight')}
                  className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap ${
                    periodFilter === 'eveningNight'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Evening/Night
                </button>
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="all">{labels.all}</option>
                <option value="pending">{labels.filterPending}</option>
                <option value="completed">{labels.filterCompleted}</option>
              </select>

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={labels.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 w-36 sm:w-48"
                />
              </div>
            </div>
          </div>

          {/* Timeline List */}
          <div className="space-y-3 pt-5">
            {filteredBlocks.map((block, idx) => {
              const isCurrent = activeBlock?.id === block.id;
              return (
                <TimeBlockCard
                  key={block.id}
                  block={block}
                  isActive={isCurrent}
                  onToggleComplete={handleToggleBlockComplete}
                  onEdit={(b) => {
                    setEditingBlock(b);
                    setIsModalOpen(true);
                  }}
                  onDelete={handleDeleteBlock}
                  onDuplicate={handleDuplicateBlock}
                  onMoveUp={(id) => handleMoveBlock(id, 'up')}
                  onMoveDown={(id) => handleMoveBlock(id, 'down')}
                  onStartFocus={handleStartFocusTask}
                  isFirst={idx === 0}
                  isLast={idx === filteredBlocks.length - 1}
                />
              );
            })}

            {filteredBlocks.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  No scheduled tasks match your search or filter
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                  Try adjusting filters or add a new task to your day.
                </p>
                <button
                  onClick={() => {
                    setEditingBlock(null);
                    setIsModalOpen(true);
                  }}
                  type="button"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>{labels.addNewBlock}</span>
                </button>
              </div>
            )}
          </div>

          {/* Bottom Add Task button */}
          {filteredBlocks.length > 0 && (
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex justify-center">
              <button
                onClick={() => {
                  setEditingBlock(null);
                  setIsModalOpen(true);
                }}
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors border border-amber-200 dark:border-amber-900/50"
              >
                <Plus className="w-4 h-4" />
                <span>{labels.addNewBlock}</span>
              </button>
            </div>
          )}
        </div>

        {/* Habits Tracker Section */}
        <HabitsTracker
          habits={state.habits}
          onUpdateCount={handleUpdateHabitCount}
          onToggleHabit={handleToggleHabit}
          onAddHabit={handleAddHabit}
          onDeleteHabit={handleDeleteHabit}
        />

        {/* Pomodoro Focus Timer */}
        <PomodoroTimer
          soundEnabled={soundEnabled}
          focusTaskName={focusTaskName}
          onClearFocusTask={() => setFocusTaskName('')}
        />

        {/* Priorities & Reflection Notes */}
        <PrioritiesAndNotes
          priorities={state.priorities}
          notes={state.notes}
          onTogglePriority={handleTogglePriority}
          onAddPriority={handleAddPriority}
          onDeletePriority={handleDeletePriority}
          onChangeNotes={handleChangeNotes}
        />
      </main>

      {/* Printable Sheet View (Visible strictly when printing) */}
      <PrintableView
        blocks={state.blocks}
        habits={state.habits}
        priorities={state.priorities}
        notes={state.notes}
      />

      {/* Add / Edit Time Block Modal */}
      <BlockModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBlock(null);
        }}
        onSave={handleSaveBlock}
        editBlock={editingBlock}
      />

      {/* Footer */}
      <footer className="no-print py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>
          Daily Scheduler • Plan purposefully, track your habits, and master your day.
        </p>
      </footer>
    </div>
  );
}
