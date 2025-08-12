import type { Season } from '../constants/enums/Seasons';

export interface CalendarDate {
  day: number;
  season: Season;
  year: number;
}
