export type CategoryType =
  | 'routine'
  | 'study'
  | 'work'
  | 'fitness'
  | 'meal'
  | 'break'
  | 'hobby'
  | 'sleep'
  | 'other';

export type PriorityType = 'high' | 'medium' | 'low';

export interface TimeBlock {
  id: string;
  title: string;
  startTime: string; // "HH:mm" (24-hour)
  endTime: string;   // "HH:mm" (24-hour)
  category: CategoryType;
  priority: PriorityType;
  notes?: string;
  completed: boolean;
}

export interface Habit {
  id: string;
  title: string;
  currentCount: number;
  targetCount: number;
  unit: string;
  iconName: string;
  completed: boolean;
}

export interface DailyPriority {
  id: string;
  text: string;
  completed: boolean;
}

export type PresetKey = 'student' | 'office' | 'fitness' | 'freelancer' | 'blank';

export interface DailyScheduleState {
  date: string;
  streak: number;
  lastActiveDate: string;
  blocks: TimeBlock[];
  habits: Habit[];
  priorities: DailyPriority[];
  notes: string;
  selectedPreset: PresetKey;
  soundEnabled: boolean;
}
