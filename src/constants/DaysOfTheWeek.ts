export const DaysOfTheWeek = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
} as const;

export type DayOfTheWeek = keyof typeof DaysOfTheWeek;
