import type { ValueOf } from '../../types/ValueOf';

export const DaysOfTheWeek = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
} as const;

export type DayOfTheWeek = ValueOf<typeof DaysOfTheWeek>;
