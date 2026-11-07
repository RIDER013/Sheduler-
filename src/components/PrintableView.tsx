import React from 'react';
import { TimeBlock, Habit, DailyPriority } from '../types';
import { labels } from '../data/translations';
import { formatFriendlyTime, calculateDuration, formatCurrentDate } from '../utils/time';

interface PrintableViewProps {
  blocks: TimeBlock[];
  habits: Habit[];
  priorities: DailyPriority[];
  notes: string;
}

export const PrintableView: React.FC<PrintableViewProps> = ({
  blocks,
  habits,
  priorities,
  notes,
}) => {
  const todayFormatted = formatCurrentDate(new Date());

  return (
    <div className="hidden print:block p-8 bg-white text-slate-900 max-w-4xl mx-auto font-sans">
      {/* Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {labels.appTitle}
          </h1>
          <p className="text-xs text-slate-600">
            {labels.appSubtitle}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold text-slate-500 uppercase">
            {labels.todayIs}
          </div>
          <div className="text-sm font-bold text-slate-900">
            {todayFormatted}
          </div>
        </div>
      </div>

      {/* Top 3 Priorities */}
      {priorities.length > 0 && (
        <div className="mb-6 p-4 border border-slate-300 rounded-lg">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
            {labels.prioritiesTitle}
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {priorities.map((p, idx) => (
              <div key={p.id} className="text-xs border-l-2 border-slate-400 pl-2">
                <span className="font-bold text-slate-600">#{idx + 1}: </span>
                <span>{p.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Table */}
      <div className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
          Daily Schedule Timeline
        </h2>
        <table className="w-full text-xs border border-slate-300 border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-left">
              <th className="p-2 border-r border-slate-300 w-12 text-center">Status</th>
              <th className="p-2 border-r border-slate-300 w-36">Time Window</th>
              <th className="p-2 border-r border-slate-300 w-24">Duration</th>
              <th className="p-2 border-r border-slate-300">Task Name</th>
              <th className="p-2 border-r border-slate-300 w-28">Category</th>
              <th className="p-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((block) => (
              <tr key={block.id} className="border-b border-slate-200">
                <td className="p-2 border-r border-slate-300 text-center font-mono">
                  [ {block.completed ? '✓' : ' '} ]
                </td>
                <td className="p-2 border-r border-slate-300 font-medium">
                  {formatFriendlyTime(block.startTime)} – {formatFriendlyTime(block.endTime)}
                </td>
                <td className="p-2 border-r border-slate-300 text-slate-600">
                  {calculateDuration(block.startTime, block.endTime)}
                </td>
                <td className="p-2 border-r border-slate-300 font-semibold text-slate-900">
                  {block.title}
                </td>
                <td className="p-2 border-r border-slate-300 text-slate-600">
                  {labels.categories[block.category]}
                </td>
                <td className="p-2 text-slate-600 italic">
                  {block.notes || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Habits & Notes row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Habits */}
        <div className="p-3 border border-slate-300 rounded-lg">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2">
            {labels.habitsTitle}
          </h3>
          <ul className="space-y-1.5 text-xs">
            {habits.map((h) => (
              <li key={h.id} className="flex justify-between items-center">
                <span>[ {h.completed ? '✓' : ' '} ] {h.title}</span>
                <span className="font-mono text-slate-500">
                  {h.currentCount}/{h.targetCount} {h.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Notes */}
        <div className="p-3 border border-slate-300 rounded-lg">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2">
            {labels.notesTitle}
          </h3>
          <p className="text-xs text-slate-700 whitespace-pre-wrap">
            {notes || 'Daily reflections and tomorrow’s priorities...'}
          </p>
        </div>
      </div>
    </div>
  );
};
