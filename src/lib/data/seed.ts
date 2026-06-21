import type { Habit } from '../types';

const ALL_DAYS = [true, true, true, true, true, true, true];
const WEEKDAYS_ONLY = [true, true, true, true, true, false, false];

export const SEED_HABITS: Habit[] = [
  {
    id: 'morning-run',
    name: 'Morning Run',
    icon: '🏃',
    repeatDays: WEEKDAYS_ONLY,
    streak: 12,
    completions: [true, true, true, true, true, false, false],
  },
  {
    id: 'meditate',
    name: 'Meditate',
    icon: '🧘',
    repeatDays: ALL_DAYS,
    streak: 7,
    completions: [true, false, true, true, true, false, false],
  },
  {
    id: 'read',
    name: 'Read 30 min',
    icon: '📚',
    repeatDays: ALL_DAYS,
    streak: 8,
    completions: [true, true, true, false, false, false, false],
  },
  {
    id: 'drink-water',
    name: 'Drink Water',
    icon: '💧',
    repeatDays: ALL_DAYS,
    streak: 5,
    completions: [true, true, true, true, false, false, false],
  },
  {
    id: 'journal',
    name: 'Journal',
    icon: '✍️',
    repeatDays: ALL_DAYS,
    streak: 9,
    completions: [true, true, true, false, false, false, false],
  },
  {
    id: 'exercise',
    name: 'Exercise',
    icon: '💪',
    repeatDays: ALL_DAYS,
    streak: 3,
    completions: [false, true, true, false, false, false, false],
  },
];

export const TODAY_LABEL = 'Friday, June 20, 2026';
export const WEEK_RANGE_LABEL = 'June 16 – June 22, 2026';
export const WEEK_DAY_DATES = [16, 17, 18, 19, 20, 21, 22];
