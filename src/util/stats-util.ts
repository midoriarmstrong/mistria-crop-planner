import type { ReadonlyDeep } from 'type-fest';
import type { StoredCropEvent } from '../types/StoredCropEvent';
import type { DaySchedule } from '../types/DaySchedule';

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
    numHarvested: harvests.length,
    numPlanted: plants.length,
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
