import type { ReadonlyDeep } from 'type-fest';
import type { StoredCropEvent } from '../types/StoredCropEvent';
import type { DaySchedule } from '../types/DaySchedule';
import type { CalendarDate } from '../types/CalendarDate';
import { DAYS_IN_SEASON } from '../constants/calendar-constants';
import { SeasonValues } from '../constants/enums/Seasons';
import { getDateForNextSeason } from './farm-util';

export const getSeasonStatsFromSchedule = (
  seasonSchedule: (DaySchedule | undefined)[] = [],
) => {
  const harvests = [];
  const plants = [];
  for (const schedule of seasonSchedule) {
    if (!schedule) continue;
    harvests.push(...(schedule.harvests ?? []));
    plants.push(...(schedule.plants ?? []));
  }

  const cost = getTotalRevenueFromEvents(plants);
  const profit = getTotalRevenueFromEvents(harvests);
  return {
    numHarvested: getTotalAmount(harvests),
    numPlanted: getTotalAmount(plants),
    cost,
    profit,
    revenue: profit - cost,
  };
};

/**
 * Gets the total profit or cost of a set of crop events of the same type.
 * @param cropEvents The crop events to calculate the combined profit or cost for.
 * @returns The total profit or cost.
 */
export const getTotalRevenueFromEvents = (
  cropEvents: ReadonlyDeep<StoredCropEvent[]>,
) => {
  return cropEvents.reduce((cost, event) => {
    cost += event.price * event.amount;
    return cost;
  }, 0);
};

/**
 * Formats the revenue into a more readable format.
 * @param revenue The raw revenue to format.
 */
export const formatRevenue = (revenue: number) => {
  if (revenue === 0) {
    return undefined;
  }

  let formattedRevenue = `${revenue}`;
  if (revenue > 0) {
    formattedRevenue = `+${formattedRevenue}`;
  }
  return `${formattedRevenue}t`;
};

/**
 * Calculates the revenue per day.
 * @param totalRevenue The total revenue.
 * @param startDate The date the first seed is planted.
 * @param endDate The date the last seed is harvested.
 * @returns The revenue per day.
 */
export const getRevenuePerDay = (
  totalRevenue: number,
  startDate: CalendarDate,
  endDate: CalendarDate,
) => {
  let numberOfDays = 0;
  while (startDate.year !== endDate.year) {
    numberOfDays += DAYS_IN_SEASON * SeasonValues.length;
    endDate.year--;
  }

  while (startDate.season !== endDate.season) {
    numberOfDays += DAYS_IN_SEASON;
    const season = getDateForNextSeason(endDate, { backward: true })?.season;
    if (!season) {
      break;
    }
    endDate.season = season;
  }

  numberOfDays += endDate.day - startDate.day + 1;
  return totalRevenue / numberOfDays;
};

export const getTotalAmount = (
  cropEvents: ReadonlyDeep<StoredCropEvent[]> = [],
) => {
  return cropEvents.reduce((amount, event) => {
    amount += event?.amount ?? 0;
    return amount;
  }, 0);
};
