import { CategoryType, PriorityType } from '../types';

export const labels = {
  appTitle: 'Daily Scheduler',
  appSubtitle: 'Your daily routine, habit tracker, and time-block planner',
  todayIs: 'Today is',
  currentTime: 'Current Time',
  activeNow: 'What is happening right now?',
  noActiveBlock: 'No scheduled task active right now (Free time / Break)',
  timeRemaining: 'Remaining',
  min: 'min',
  mins: 'mins',
  hrs: 'hrs',
  markDone: 'Mark Complete',
  completed: 'Completed',
  pending: 'Pending',
  inProgress: 'In Progress',
  upcoming: 'Upcoming',
  progress: 'Daily Progress',
  streak: 'Daily Streak',
  streakDays: 'days streak!',
  allTasksDone: 'Awesome! All scheduled tasks completed! 🎉',
  
  // Tabs & Filters
  all: 'All Tasks',
  morning: 'Morning (5 AM - 12 PM)',
  afternoon: 'Afternoon (12 PM - 5 PM)',
  eveningNight: 'Evening & Night',
  filterPending: 'Pending Only',
  filterCompleted: 'Completed Only',
  searchPlaceholder: 'Search scheduled tasks...',
  
  // Actions
  addNewBlock: '+ Add New Task',
  editBlock: 'Edit',
  deleteBlock: 'Delete',
  confirmDelete: 'Are you sure you want to delete this task?',
  confirmPreset: 'Switching preset will replace current schedule blocks. Continue?',
  confirmResetDay: 'Reset completion status for a fresh day? (Tasks will be preserved)',
  resetDayBtn: 'Start New Day (Reset)',
  printSchedule: 'Print / Save PDF',
  backupExport: 'Export Backup',
  backupImport: 'Import Backup',
  presetLabel: 'Routine Presets',
  customSchedule: 'Custom Schedule',
  
  // Categories
  categories: {
    routine: 'Morning/Night Routine',
    study: 'Study & Learning',
    work: 'Deep Work & Office',
    fitness: 'Fitness & Health',
    meal: 'Breakfast & Meals',
    break: 'Break & Refreshment',
    hobby: 'Hobby & Personal',
    sleep: 'Rest & Sleep',
    other: 'Other Activities',
  } as Record<CategoryType, string>,
  
  // Priorities
  priorities: {
    high: 'High Priority',
    medium: 'Medium Priority',
    low: 'Low Priority',
  } as Record<PriorityType, string>,
  
  // Form fields
  taskTitle: 'Task Name',
  startTime: 'Start Time',
  endTime: 'End Time',
  category: 'Category',
  priority: 'Priority',
  notesPlaceholder: 'Any instructions, checklist, or location details...',
  save: 'Save',
  cancel: 'Cancel',
  close: 'Close',
  
  // Sections
  habitsTitle: 'Daily Habits & Wellness',
  habitsSubtitle: 'Essential goals to conquer every single day',
  addHabit: '+ Add Habit',
  prioritiesTitle: 'Top 3 Daily Priorities',
  prioritiesSubtitle: 'What 3 outcomes matter most today?',
  addPriority: '+ Add Priority',
  notesTitle: 'Daily Reflections & Quick Notes',
  dailyNotesPlaceholder: 'Jot down thoughts, lessons learned, or plan for tomorrow...',
  
  // Pomodoro Timer
  focusTimerTitle: 'Pomodoro Focus Timer',
  focusMode: 'Deep Focus',
  shortBreak: 'Short Break (5m)',
  longBreak: 'Long Break (15m)',
  start: 'Start',
  pause: 'Pause',
  reset: 'Reset',
  timerCompletedMsg: 'Great job! Focus sprint complete. Take a breather!',
  soundOn: 'Sound On',
  soundOff: 'Sound Muted',

  // Presets
  presets: {
    student: 'Student Routine',
    studentDesc: 'Balanced schedule with deep study, classes, revision & play',
    office: 'Working Professional',
    officeDesc: 'Work priorities, commute, meetings and personal unwind time',
    fitness: 'Health & Fitness Routine',
    fitnessDesc: 'Dedicated workouts, wholesome nutrition, hydration & recovery',
    freelancer: 'Freelancer / Remote',
    freelancerDesc: 'Client deliverables, creative focus blocks & flexible hours',
    blank: 'Blank Canvas',
    blankDesc: 'Build your custom routine completely from scratch',
  },
};

export const getCategoryColor = (category: CategoryType) => {
  switch (category) {
    case 'routine':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        border: 'border-amber-200 dark:border-amber-800/60',
        text: 'text-amber-800 dark:text-amber-200',
        badge: 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-100',
      };
    case 'study':
      return {
        bg: 'bg-indigo-50 dark:bg-indigo-950/40',
        border: 'border-indigo-200 dark:border-indigo-800/60',
        text: 'text-indigo-800 dark:text-indigo-200',
        badge: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/60 dark:text-indigo-100',
      };
    case 'work':
      return {
        bg: 'bg-sky-50 dark:bg-sky-950/40',
        border: 'border-sky-200 dark:border-sky-800/60',
        text: 'text-sky-800 dark:text-sky-200',
        badge: 'bg-sky-100 text-sky-900 dark:bg-sky-900/60 dark:text-sky-100',
      };
    case 'fitness':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        border: 'border-emerald-200 dark:border-emerald-800/60',
        text: 'text-emerald-800 dark:text-emerald-200',
        badge: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-100',
      };
    case 'meal':
      return {
        bg: 'bg-orange-50 dark:bg-orange-950/40',
        border: 'border-orange-200 dark:border-orange-800/60',
        text: 'text-orange-800 dark:text-orange-200',
        badge: 'bg-orange-100 text-orange-900 dark:bg-orange-900/60 dark:text-orange-100',
      };
    case 'break':
      return {
        bg: 'bg-teal-50 dark:bg-teal-950/40',
        border: 'border-teal-200 dark:border-teal-800/60',
        text: 'text-teal-800 dark:text-teal-200',
        badge: 'bg-teal-100 text-teal-900 dark:bg-teal-900/60 dark:text-teal-100',
      };
    case 'hobby':
      return {
        bg: 'bg-purple-50 dark:bg-purple-950/40',
        border: 'border-purple-200 dark:border-purple-800/60',
        text: 'text-purple-800 dark:text-purple-200',
        badge: 'bg-purple-100 text-purple-900 dark:bg-purple-900/60 dark:text-purple-100',
      };
    case 'sleep':
      return {
        bg: 'bg-slate-100 dark:bg-slate-800/60',
        border: 'border-slate-300 dark:border-slate-700',
        text: 'text-slate-700 dark:text-slate-300',
        badge: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
      };
    case 'other':
    default:
      return {
        bg: 'bg-gray-50 dark:bg-gray-900/40',
        border: 'border-gray-200 dark:border-gray-800',
        text: 'text-gray-800 dark:text-gray-200',
        badge: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      };
  }
};
