import React from 'react';
import { TimeBlock } from '../types';
import { labels, getCategoryColor } from '../data/translations';
import { formatFriendlyTime, calculateDuration } from '../utils/time';
import {
  Check,
  Edit3,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Timer,
  BookOpen,
  Briefcase,
  Dumbbell,
  Coffee,
  Sparkles,
  Moon,
  Clock,
} from 'lucide-react';

interface TimeBlockCardProps {
  block: TimeBlock;
  isActive: boolean;
  onToggleComplete: (id: string) => void;
  onEdit: (block: TimeBlock) => void;
  onDelete: (id: string) => void;
  onDuplicate: (block: TimeBlock) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onStartFocus: (taskName: string) => void;
  isFirst: boolean;
  isLast: boolean;
}

export const TimeBlockCard: React.FC<TimeBlockCardProps> = ({
  block,
  isActive,
  onToggleComplete,
  onEdit,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onStartFocus,
  isFirst,
  isLast,
}) => {
  const colorTheme = getCategoryColor(block.category);

  const renderCategoryIcon = () => {
    switch (block.category) {
      case 'routine':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'study':
        return <BookOpen className="w-3.5 h-3.5" />;
      case 'work':
        return <Briefcase className="w-3.5 h-3.5" />;
      case 'fitness':
        return <Dumbbell className="w-3.5 h-3.5" />;
      case 'meal':
      case 'break':
        return <Coffee className="w-3.5 h-3.5" />;
      case 'sleep':
        return <Moon className="w-3.5 h-3.5" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div
      className={`group relative flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl border transition-all ${
        isActive
          ? 'border-amber-400 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs ring-1 ring-amber-400/40'
          : block.completed
          ? 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 opacity-75'
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggleComplete(block.id)}
        type="button"
        className={`mt-1 flex items-center justify-center w-5 h-5 rounded-md border transition-all shrink-0 ${
          block.completed
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : 'border-slate-300 dark:border-slate-600 hover:border-amber-500 dark:hover:border-amber-400 bg-white dark:bg-slate-800'
        }`}
        aria-label={block.completed ? labels.completed : labels.pending}
      >
        {block.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </button>

      {/* Main Block Content */}
      <div className="flex-1 min-w-0">
        {/* Time and Category Metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono tabular-nums">
            {formatFriendlyTime(block.startTime)} – {formatFriendlyTime(block.endTime)}
          </span>
          <span aria-hidden="true">·</span>
          <span>{calculateDuration(block.startTime, block.endTime)}</span>
          <span aria-hidden="true">·</span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${colorTheme.badge}`}>
            {renderCategoryIcon()}
            <span>{labels.categories[block.category]}</span>
          </span>

          {/* Priority indicator */}
          {block.priority === 'high' && (
            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
              [!] High Priority
            </span>
          )}

          {isActive && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full">
              ● {labels.inProgress}
            </span>
          )}
        </div>

        {/* Task Title */}
        <h4
          className={`text-sm sm:text-base font-semibold tracking-tight transition-colors ${
            block.completed
              ? 'line-through text-slate-400 dark:text-slate-500'
              : 'text-slate-900 dark:text-white'
          }`}
        >
          {block.title}
        </h4>

        {/* Notes (if provided) */}
        {block.notes && (
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
            {block.notes}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="no-print flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
        {/* Focus in Pomodoro */}
        <button
          onClick={() => onStartFocus(block.title)}
          type="button"
          className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title="Focus in Pomodoro Timer"
        >
          <Timer className="w-4 h-4" />
        </button>

        {/* Reorder Up */}
        <button
          onClick={() => onMoveUp(block.id)}
          disabled={isFirst}
          type="button"
          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-20"
          title="Move Up"
        >
          <ChevronUp className="w-4 h-4" />
        </button>

        {/* Reorder Down */}
        <button
          onClick={() => onMoveDown(block.id)}
          disabled={isLast}
          type="button"
          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-20"
          title="Move Down"
        >
          <ChevronDown className="w-4 h-4" />
        </button>

        {/* Duplicate */}
        <button
          onClick={() => onDuplicate(block)}
          type="button"
          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors hidden sm:block"
          title="Duplicate Task"
        >
          <Copy className="w-4 h-4" />
        </button>

        {/* Edit */}
        <button
          onClick={() => onEdit(block)}
          type="button"
          className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title={labels.editBlock}
        >
          <Edit3 className="w-4 h-4" />
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(block.id)}
          type="button"
          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
          title={labels.deleteBlock}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
