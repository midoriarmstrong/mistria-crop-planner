import type { ReadonlyDeep } from 'type-fest';
import type { PlantFormFields } from '../calendar/plant/PlantDialogForm';
import { DAYS_IN_SEASON } from '../constants/calendar-constants';
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
import type { YearSchedule } from '../types/YearSchedule';

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
  console.log(events, cropEvent);
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
 * @param cropSeasons The seasons the crop can grow in.
 * @param season The current season.
 * @returns The next season.
 */
const getNextSeason = (cropSeasons: ReadonlyDeep<Season[]>, season: Season) => {
  const nextId = SeasonIds[season] + 1;
  const nextSeason = SeasonValues[nextId];
  if (!nextSeason || !cropSeasons.includes(nextSeason)) {
    return undefined;
  }
  return nextSeason;
};

/**
 * Gets the harvest day for a crop.
 * @param options.day The day the crop was planted.
 * @param options.daysToGrow The number of days the seed takes to fully grow.
 * @param options.growthDay The day the Growth spell was cast, if applicable.
 * @returns The day the crop can be harvested.
 */
const getHarvestDay = ({
  day,
  growthDay,
  daysToGrow,
}: {
  day: number;
  growthDay?: number;
  daysToGrow: number;
}) => {
  let harvestDay = day;
  if (growthDay) {
    harvestDay += growthDay;
  } else {
    harvestDay += daysToGrow;
  }
  return harvestDay;
};

/**
 * Adds the newly submitted plant event.
 * @param day The day the seed(s) are planted.
 * @param season The season the seed(s) are planted.
 * @param fields The submitted form fields.
 * @param schedule The current year schedule.
 */
const addPlantEventFromFields = (
  day: number,
  season: Season,
  fields: PlantFormFields,
  schedule: YearSchedule,
) => {
  schedule[season][day] = getUpdatedDaySchedule(
    { cropId: fields.cropId, amount: fields.amount, price: fields.seedPrice },
    CropEventTypes.Plant,
    schedule[season][day],
  );
};

/**
 * Adds a new harvest event for the newly submitted plant event.
 * @param day The day the seed(s) are planted.
 * @param season The season the seed(s) are planted.
 * @param fields The submitted form fields.
 * @param schedule The current year schedule.
 */
const addHarvestEventFromFields = (
  day: number,
  season: Season,
  fields: PlantFormFields,
  schedule: YearSchedule,
) => {
  const crop = CROPS_BY_ID[fields.cropId];
  const harvestDay = getHarvestDay({
    day,
    growthDay: fields.growthDay,
    daysToGrow: crop.daysToGrow,
  });

  const harvestEvent = {
    cropId: crop.id,
    amount: fields.amount,
    price: crop.sellPrice,
  };

  console.log(harvestDay, harvestEvent);
  if (harvestDay < DAYS_IN_SEASON) {
    schedule[season][harvestDay] = getUpdatedDaySchedule(
      harvestEvent,
      CropEventTypes.Harvest,
      schedule[season][harvestDay],
    );
  }

  const nextSeason = getNextSeason(crop.seasons, season);
  const nextSeasonDay = harvestDay - DAYS_IN_SEASON;
  if (!nextSeason || nextSeasonDay >= DAYS_IN_SEASON) {
    return;
  }

  schedule[nextSeason][nextSeasonDay] = getUpdatedDaySchedule(
    harvestEvent,
    CropEventTypes.Harvest,
    schedule[nextSeason][nextSeasonDay],
  );
};

/**
 * Adds new harvest and plant events when a plant can regrow.
 * @param day The day the original seed(s) are planted.
 * @param season The season the original seed(s) are planted.
 * @param fields The submitted form fields.
 * @param schedule The current year schedule.
 */
// const addRegrowEventsFromFields = (
//   day: number,
//   season: Season,
//   fields: PlantFormFields,
//   schedule: YearSchedule,
// ) => {};

/**
 * Adds all crop events for a newly submitted plant event.
 * @param day The day the seed(s) are planted.
 * @param season The season the seed(s) are planted.
 * @param fields The submitted form fields.
 * @param schedule The current year schedule.
 * @returns The updated year schedule.
 */
export const addAllCropEvents = (
  day: number,
  season: Season,
  fields: PlantFormFields,
  schedule: YearSchedule,
): YearSchedule => {
  const crop = CROPS_BY_ID[fields.cropId];
  const newSchedule = { ...schedule };
  addPlantEventFromFields(day, season, fields, newSchedule);
  addHarvestEventFromFields(day, season, fields, newSchedule);
  if (crop.daysToRegrow || fields.autoplant) {
    // addRegrowEventsFromFields(day, season, fields, newSchedule);
  }
  return newSchedule;
};
