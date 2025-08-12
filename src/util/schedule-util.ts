import type { ReadonlyDeep } from 'type-fest';
import type { PlantFormFields } from '../calendar/plant/PlantDialogForm';
import {
  DAYS_IN_SEASON,
  EMPTY_YEAR_SCHEDULE,
} from '../constants/calendar-constants';
import {
  CropEventTypes,
  type CropEventType,
} from '../constants/enums/CropEventType';
import {
  SeasonIds,
  SeasonValues,
  type Season,
} from '../constants/enums/Seasons';
import { CROPS_BY_ID } from '../constants/tables/Crops';
import type { DaySchedule } from '../types/DaySchedule';
import type { StoredCropEvent } from '../types/StoredCropEvent';
import type { CalendarDate } from '../types/CalendarDate';
import type { Schedule } from '../types/Schedule';
import { cloneDeep } from 'lodash';

/**
 * Adds a crop event to a day schedule.
 * @param cropEvent The crop event to add.
 * @param existingSchedule The existing day schedule.
 * @returns The updated day schedule.
 */
export const getUpdatedDaySchedule = (
  cropEvent: StoredCropEvent,
  cropEventType: CropEventType,
  existingSchedule?: DaySchedule,
): DaySchedule => {
  if (!existingSchedule) {
    return { [cropEventType]: [cropEvent] };
  }

  const events = [...(existingSchedule[cropEventType] ?? [])];
  const existingEventIndex = events.findIndex(
    (event) =>
      event.cropId == cropEvent.cropId && event.price === cropEvent.price,
  );
  if (existingEventIndex >= 0) {
    events[existingEventIndex].amount += cropEvent.amount;
  } else {
    events.push(cropEvent);
  }

  return {
    ...existingSchedule,
    [cropEventType]: events,
  };
};

/**
 * Gets the season that follows the current season.
 * @param date The current date.
 * @param cropSeasons The seasons the crop can grow in.
 * @returns The next season.
 */
const getNextPlantableDate = (
  date: CalendarDate,
  cropSeasons: ReadonlyDeep<Season[]>,
) => {
  const nextSeason = SeasonValues[SeasonIds[date.season] + 1];
  if (!cropSeasons.includes(nextSeason)) {
    return undefined;
  }

  const nextDay = date.day - DAYS_IN_SEASON;
  if (!nextSeason) {
    return {
      day: nextDay,
      season: SeasonValues[0],
      year: date.year + 1,
    };
  }

  return { ...date, day: nextDay, season: nextSeason };
};

export const getNextSeasonIdAndYear = (
  seasonId: number,
  year: number = 0,
  backward = false,
): [number, number] | undefined => {
  const direction = backward ? -1 : 1;
  const nextSeasonId = seasonId + direction;
  if (!SeasonValues[nextSeasonId]) {
    const nextYear = year + direction;
    if (nextYear < 0) {
      return undefined;
    }

    return [backward ? SeasonValues.length - 1 : 0, year + direction];
  }
  return [nextSeasonId, year];
};

/**
 * Gets the harvest day for a crop.
 * @param options.day The day the crop was planted.
 * @param options.growthDay The day the Growth spell was cast, if applicable.
 * @param options.daysToGrow The number of days the seed takes to fully grow (or regrow).
 * @returns The day the crop can be harvested.
 */
const getHarvestDay = ({
  day,
  growthDay,
  daysToGrow = 0,
}: {
  day: number;
  growthDay?: number;
  daysToGrow?: number;
}) => {
  let harvestDay = day;
  if (growthDay != undefined && growthDay >= 0) {
    harvestDay += growthDay;
  } else {
    harvestDay += daysToGrow;
  }
  return harvestDay;
};

/**
 * Adds the newly submitted plant event.
 * @param date The date the seed(s) are planted.
 * @param firstHarvestDate The date the seed(s) are first harvested.
 * @param fields The submitted form fields.
 * @param schedule The current full schedule.
 */
const addPlantEventFromFields = (
  date: CalendarDate,
  firstHarvestDate: CalendarDate,
  { cropId, groupId, amount, seedPrice, autoplant }: PlantFormFields,
  schedule: Schedule,
) => {
  if (!schedule[date.year]) {
    schedule[date.year] = cloneDeep(EMPTY_YEAR_SCHEDULE);
  }

  schedule[date.year][date.season][date.day] = getUpdatedDaySchedule(
    {
      cropId,
      groupId,
      amount,
      price: seedPrice,
      firstHarvestDate,
      ...(autoplant ? { autoplant } : {}),
    },
    CropEventTypes.Plant,
    schedule[date.year][date.season][date.day],
  );
};

/**
 * Adds a new harvest event for the newly submitted plant event, if valid.
 * @param date The date the seed was planted.
 * @param fields The submitted form fields.
 * @param schedule The current full schedule.
 * @returns The day and season the plant was harvested.
 */
const addHarvestEventFromFields = (
  date: CalendarDate,
  { cropId, groupId, growthDay, amount }: PlantFormFields,
  schedule: Schedule,
  forRegrow = false,
): CalendarDate | undefined => {
  const crop = CROPS_BY_ID[cropId];
  const harvestDay = getHarvestDay({
    day: date.day,
    growthDay,
    daysToGrow: forRegrow ? crop.daysToRegrow : crop.daysToGrow,
  });
  const harvestEvent = {
    groupId,
    cropId,
    amount,
    price: crop.sellPrice,
  };

  if (!schedule[date.year]) {
    schedule[date.year] = cloneDeep(EMPTY_YEAR_SCHEDULE);
  }

  if (harvestDay < DAYS_IN_SEASON) {
    schedule[date.year][date.season][harvestDay] = getUpdatedDaySchedule(
      harvestEvent,
      CropEventTypes.Harvest,
      schedule[date.year][date.season][harvestDay],
    );
    return { day: harvestDay, season: date.season, year: date.year };
  }

  const nextDate = getNextPlantableDate(
    {
      ...date,
      day: harvestDay,
    },
    crop.seasons,
  );
  if (!nextDate || nextDate.day >= DAYS_IN_SEASON) {
    return;
  }

  if (!schedule[nextDate.year]) {
    schedule[nextDate.year] = cloneDeep(EMPTY_YEAR_SCHEDULE);
  }

  schedule[nextDate.year][nextDate.season][nextDate.day] =
    getUpdatedDaySchedule(
      harvestEvent,
      CropEventTypes.Harvest,
      schedule[nextDate.year][nextDate.season][nextDate.day],
    );
  return nextDate;
};

/**
 * Adds new harvest and plant events when a plant can regrow.
 * @param date The day the original seed(s) are planted.
 * @param fields The submitted form fields.
 * @param schedule The current full schedule.
 */
const addRegrowEventsFromFields = (
  date: CalendarDate,
  fields: PlantFormFields,
  schedule: Schedule,
) => {
  const regrowFields = { ...fields, growthDay: undefined };
  let plantDate = { ...date };
  let harvestDate: CalendarDate | undefined = addHarvestEventFromFields(
    plantDate,
    regrowFields,
    schedule,
    !fields.autoplant,
  );

  while (harvestDate) {
    if (regrowFields.autoplant) {
      addPlantEventFromFields(plantDate, harvestDate, regrowFields, schedule);
    }

    plantDate = harvestDate;
    harvestDate = addHarvestEventFromFields(
      harvestDate,
      regrowFields,
      schedule,
      !fields.autoplant,
    );
  }
};

/**
 * Adds all crop events for a newly submitted plant event.
 * @param day The day the seed(s) are planted.
 * @param season The season the seed(s) are planted.
 * @param fields The submitted form fields.
 * @param schedule The current full schedule.
 * @returns The updated year schedule.
 */
export const addAllCropEvents = (
  date: CalendarDate,
  fields: PlantFormFields,
  schedule: Schedule,
): { schedule?: Schedule; error?: string } => {
  const crop = CROPS_BY_ID[fields.cropId];

  const harvestDate = addHarvestEventFromFields(date, fields, schedule);

  if (!harvestDate) {
    return {
      error: 'This crop cannot be harvested before the end of its season.',
    };
  }

  addPlantEventFromFields(date, harvestDate, fields, schedule);

  if (crop.daysToRegrow || fields.autoplant) {
    addRegrowEventsFromFields(harvestDate, fields, schedule);
  }

  return { schedule };
};
