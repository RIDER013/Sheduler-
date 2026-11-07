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

export interface DialPin {
  id: string;
  title: string;
  time: string; // "HH:mm"
  category: CategoryType;
  iconName?: string; // 'study' | 'gym' | 'sleep' | 'water' | 'food' | 'work' | 'sparkles'
  photoUrl?: string; // base64 or url
}

export type DialThemeStyle = 'classic' | 'modernMidnight' | 'minimalistMono' | 'electricNeon' | 'aesthetic';

export interface DialStyleConfig {
  theme: DialThemeStyle;
  handColor: string;
  showSeconds: boolean;
  hourFormat24: boolean;
}

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
  dialPins: DialPin[];
  dialStyle: DialStyleConfig;
}
