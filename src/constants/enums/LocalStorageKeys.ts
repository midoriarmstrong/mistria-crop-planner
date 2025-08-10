import type { ValueOf } from '../../types/ValueOf';

export const LocalStorageKeys = {
  Schedule: 'calendar-schedule',
} as const;

export type LocalStorageKey = ValueOf<typeof LocalStorageKeys>;
