import type { Season } from '../constants/enums/Seasons';
import type { DaySchedule } from './DaySchedule';

export type YearSchedule = {
  [season in Season]: DaySchedule[];
};
