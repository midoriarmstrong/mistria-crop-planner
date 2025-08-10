import type { ValueOf } from '../../types/ValueOf';

export const Seasons = {
  Spring: 'Spring',
  Summer: 'Summer',
  Fall: 'Fall',
  Winter: 'Winter',
} as const;

export type Season = ValueOf<typeof Seasons>;
