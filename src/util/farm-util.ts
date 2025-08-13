import { SeasonIds, SeasonValues } from '../constants/enums/Seasons';
import type { CalendarDate } from '../types/CalendarDate';
import type { Farm } from '../types/Farm';

/**
 * Updates a farm's current date.
 * @param farm The current farm settings.
 * @param setFarm The farm setter.
 * @param options.previousDate The pre-calculated previous date.
 * @param options.nextDate The pre-calculated next date.
 * @param options.backward Whether the next date is backward in time.
 */
export const incrementCurrentDate = (
  farm: Farm,
  setFarm: React.Dispatch<React.SetStateAction<Farm>>,
  {
    previousDate,
    nextDate,
    backward = false,
  }: {
    nextDate?: CalendarDate;
    previousDate?: CalendarDate;
    backward?: boolean;
  } = {},
) => {
  const date =
    (backward ? previousDate : nextDate) ??
    getDateForNextSeason(farm.currentDate, { backward });
  if (!date) {
    return;
  }

  setFarm({ ...farm, currentDate: date });
};

/**
 * Gets the date for the next season.
 * @param date The date for the current season.
 * @param options.backward Whether the next season is going backward.
 * @returns The date for the next season.
 */
export const getDateForNextSeason = (
  date: CalendarDate,
  { backward = false }: { backward?: boolean } = {},
): CalendarDate | undefined => {
  const direction = backward ? -1 : 1;
  const nextSeasonId = SeasonIds[date.season] + direction;
  if (!SeasonValues[nextSeasonId]) {
    const nextYear = date.year + direction;
    if (nextYear < 0) {
      return undefined;
    }

    return {
      ...date,
      season: SeasonValues[backward ? SeasonValues.length - 1 : 0],
      year: date.year + direction,
    };
  }

  return { ...date, season: SeasonValues[nextSeasonId] };
};
