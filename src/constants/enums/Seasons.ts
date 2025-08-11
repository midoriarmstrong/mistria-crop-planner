import type { ValueOf } from 'type-fest';

export const Seasons = {
  Spring: 'Spring',
  Summer: 'Summer',
  Fall: 'Fall',
  Winter: 'Winter',
} as const;

export const SeasonIds = {
  Spring: 0,
  Summer: 1,
  Fall: 2,
  Winter: 3,
} as const;

export const SeasonValues = Object.values(Seasons);

export type Season = ValueOf<typeof Seasons>;
