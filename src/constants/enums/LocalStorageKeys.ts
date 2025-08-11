import type { ValueOf } from 'type-fest';

export const LocalStorageKeys = {
  Schedule: 'calendar-schedule',
  Farm: 'farm',
} as const;

export type LocalStorageKey = ValueOf<typeof LocalStorageKeys>;
