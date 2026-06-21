export const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export const TODAY_INDEX = 4; // Friday, matching the design's demo week

export interface Habit {
  id: string;
  name: string;
  icon: string;
  /** true for each weekday (Mon..Sun) this habit is scheduled on */
  repeatDays: boolean[];
  /** current streak in days, ending today */
  streak: number;
  /** completion state for the demo week, indexed Mon(0)..Sun(6) */
  completions: boolean[];
}

export const ICON_CHOICES = ['🏃', '🧘', '📚', '💧', '✍️', '💪', '🍎', '💊'];

/** One real calendar day's overall completion snapshot, for the Month graph. */
export interface HistoryEntry {
  /** YYYY-MM-DD, actual calendar date */
  date: string;
  completed: number;
  total: number;
}

export interface PersistedState {
  habits: Habit[];
  history: HistoryEntry[];
}
