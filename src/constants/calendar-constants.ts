import type { YearSchedule } from '../types/YearSchedule';
import { Seasons } from './enums/Seasons';

export const DAYS_IN_SEASON = 28;
export const DAYS_IN_WEEK = 7;
export const WEEKS_IN_SEASON = Math.round(DAYS_IN_SEASON / DAYS_IN_WEEK);
export const DAYS_IN_SEASON_GROUPED_BY_WEEK = Array(WEEKS_IN_SEASON)
  .fill(0)
  .map((_, week) => {
    return Array(DAYS_IN_WEEK)
      .fill(0)
      .map((_, day) => week * DAYS_IN_WEEK + day);
  });

export const EMPTY_YEAR_SCHEDULE = Object.values(Seasons).reduce(
  (seasonSchedule, season) => {
    seasonSchedule[season] = Array(DAYS_IN_SEASON).fill(undefined);
    return seasonSchedule;
  },
  {} as YearSchedule,
);
