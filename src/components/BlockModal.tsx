import React, { useState, useEffect } from 'react';
import { TimeBlock, CategoryType, PriorityType } from '../types';
import { labels } from '../data/translations';
import { timeToMinutes } from '../utils/time';
import { X, Clock } from 'lucide-react';

interface BlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (block: Omit<TimeBlock, 'id' | 'completed'> & { id?: string }) => void;
  editBlock?: TimeBlock | null;
}

export const BlockModal: React.FC<BlockModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editBlock,
}) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [category, setCategory] = useState<CategoryType>('work');
  const [priority, setPriority] = useState<PriorityType>('medium');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editBlock) {
      setTitle(editBlock.title);
      setStartTime(editBlock.startTime);
      setEndTime(editBlock.endTime);
      setCategory(editBlock.category);
      setPriority(editBlock.priority);
      setNotes(editBlock.notes || '');
    } else {
      setTitle('');
      setStartTime('09:00');
      setEndTime('10:00');
      setCategory('work');
      setPriority('medium');
      setNotes('');
    }
    setError('');
  }, [editBlock, isOpen]);

  if (!isOpen) return null;

  const addMinutesToEnd = (mins: number) => {
    const startMins = timeToMinutes(startTime);
    let newEndMins = (startMins + mins) % (24 * 60);
    const h = Math.floor(newEndMins / 60);
    const m = newEndMins % 60;
    const formatted = `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`;
    setEndTime(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a task title');
      return;
    }

    onSave({
      id: editBlock?.id,
      title: title.trim(),
      startTime,
      endTime,
      category,
      priority,
      notes: notes.trim(),
    });
    onClose();
  };

  const categoriesList: CategoryType[] = [
    'routine',
    'study',
    'work',
    'fitness',
    'meal',
    'break',
    'hobby',
    'sleep',
    'other',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {editBlock ? labels.editBlock : labels.addNewBlock}
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-lg border border-rose-200 dark:border-rose-900/50">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {labels.taskTitle} *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mathematics Practice, Client Sync, 5km Run..."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Times Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {labels.startTime}
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {labels.endTime}
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Duration Quick Helpers */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Quick duration:
            </span>
            {[15, 30, 45, 60, 90, 120].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => addMinutesToEnd(m)}
                className="px-2 py-0.5 text-xs font-medium rounded border border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:border-amber-300 text-slate-600 dark:text-slate-300 transition-colors"
              >
                +{m >= 60 ? `${m / 60}h` : `${m}m`}
              </button>
            ))}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {labels.category}
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-2.5 py-1.5 text-xs rounded-lg border text-left truncate transition-colors ${
                    category === cat
                      ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 font-semibold text-amber-900 dark:text-amber-100 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {labels.categories[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {labels.priority}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['high', 'medium', 'low'] as PriorityType[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-1.5 px-3 text-xs font-medium rounded-lg border text-center transition-colors ${
                    priority === p
                      ? p === 'high'
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-200 font-semibold'
                        : p === 'medium'
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-800 dark:text-amber-200 font-semibold'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-400 text-slate-800 dark:text-slate-200 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {labels.priorities[p]}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Notes / Sub-tasks
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={labels.notesPlaceholder}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              {labels.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-lg shadow-xs transition-colors"
            >
              {labels.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
