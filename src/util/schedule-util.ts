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
const getNextPlantableSeason = (
  cropSeasons: ReadonlyDeep<Season[]>,
  season: Season,
) => {
  const nextSeason = SeasonValues[SeasonIds[season] + 1];
  if (!nextSeason || !cropSeasons.includes(nextSeason)) {
    return undefined;
  }
  return nextSeason;
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
 * Adds a new harvest event for the newly submitted plant event, if valid.
 * @param day The day the seed(s) are planted.
 * @param season The season the seed(s) are planted.
 * @param fields The submitted form fields.
 * @param schedule The current year schedule.
 * @returns The day and season the plant was harvested.
 */
const addHarvestEventFromFields = (
  day: number,
  season: Season,
  {
    cropId,
    growthDay,
    amount,
  }: Pick<PlantFormFields, 'cropId' | 'growthDay' | 'amount'>,
  schedule: YearSchedule,
  forRegrow = false,
): { day: number; season: Season } | undefined => {
  const crop = CROPS_BY_ID[cropId];
  const harvestDay = getHarvestDay({
    day,
    growthDay,
    daysToGrow: forRegrow ? crop.daysToRegrow : crop.daysToGrow,
  });

  const harvestEvent = {
    cropId,
    amount,
    price: crop.sellPrice,
  };

  if (harvestDay < DAYS_IN_SEASON) {
    schedule[season][harvestDay] = getUpdatedDaySchedule(
      harvestEvent,
      CropEventTypes.Harvest,
      schedule[season][harvestDay],
    );
    return { day: harvestDay, season };
  }

  const nextSeason = getNextPlantableSeason(crop.seasons, season);
  const nextSeasonDay = harvestDay - DAYS_IN_SEASON;
  if (!nextSeason || nextSeasonDay >= DAYS_IN_SEASON) {
    return;
  }

  schedule[nextSeason][nextSeasonDay] = getUpdatedDaySchedule(
    harvestEvent,
    CropEventTypes.Harvest,
    schedule[nextSeason][nextSeasonDay],
  );
  return { day: nextSeasonDay, season: nextSeason };
};

/**
 * Adds new harvest and plant events when a plant can regrow.
 * @param day The day the original seed(s) are planted.
 * @param season The season the original seed(s) are planted.
 * @param fields The submitted form fields.
 * @param schedule The current year schedule.
 */
const addRegrowEventsFromFields = (
  day: number,
  season: Season,
  fields: PlantFormFields,
  schedule: YearSchedule,
) => {
  let harvestSchedule: { day: number; season: Season } | undefined = {
    day,
    season,
  };

  do {
    harvestSchedule = addHarvestEventFromFields(
      harvestSchedule.day,
      harvestSchedule.season,
      fields,
      schedule,
      !fields.autoplant,
    );

    if (fields.autoplant && harvestSchedule) {
      addPlantEventFromFields(
        harvestSchedule.day,
        harvestSchedule.season,
        fields,
        schedule,
      );
    }
  } while (harvestSchedule);
};

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
  const harvestSchedule = addHarvestEventFromFields(
    day,
    season,
    fields,
    newSchedule,
  );
  if ((crop.daysToRegrow || fields.autoplant) && harvestSchedule) {
    addRegrowEventsFromFields(
      harvestSchedule.day,
      harvestSchedule.season,
      fields,
      newSchedule,
    );
  }
  return newSchedule;
};
