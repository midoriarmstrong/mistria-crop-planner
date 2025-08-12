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
import { SeasonIds, SeasonValues } from '../constants/enums/Seasons';
import { CROPS_BY_ID } from '../constants/tables/Crops';
import type { DaySchedule } from '../types/DaySchedule';
import type { StoredCropEvent } from '../types/StoredCropEvent';
import type { CalendarDate } from '../types/CalendarDate';
import type { Schedule } from '../types/Schedule';
import cloneDeep from 'lodash/cloneDeep';
import type { CropEvent } from '../types/CropEvent';
import type { Crop } from '../types/Crop';
import isEqual from 'lodash/isEqual';

/**
 * Sets the schedule for a year, handling initializing an empty year
 * schedule if it does not exist.
 * @param year The year to set.
 * @param schedule The full schedule.
 * @returns The year schedule.
 */
export const getScheduleForYear = (year: number, schedule: Schedule) => {
  if (!schedule[year]) {
    schedule[year] = cloneDeep(EMPTY_YEAR_SCHEDULE);
  }

  return schedule[year];
};

/**
 * Sets the schedule on a date, handling initializing an empty year
 * schedule if it does not exist.
 * @param date The date to set.
 * @param daySchedule The day schedule to set.
 * @param schedule The full schedule to update.
 */
export const setScheduleOnDate = (
  date: CalendarDate,
  schedule: Schedule,
  daySchedule?: DaySchedule,
): void => {
  getScheduleForYear(date.year, schedule)[date.season][date.day] = daySchedule;
};

/**
 * Finds the index of the crop event the matches the new crop event.
 * @param cropEvent The crop event to match to an existing list.
 * @param cropEvents The crop events to search through.
 * @param eventType The type of the crop events to search through.
 * @param options.ignoreHarvestDate Whether to ignore whether the first harvest date matches.
 * @returns The index, or -1 if it wasn't found.
 */
export const findEventIndexByCropEvent = (
  cropEvent: StoredCropEvent,
  cropEvents: StoredCropEvent[] = [],
  eventType: CropEventType,
  { ignoreHarvestDate = false }: { ignoreHarvestDate?: boolean } = {},
) => {
  if (eventType === cropEvent.type) {
    return cropEvents.findIndex(
      (event) =>
        event.cropId === cropEvent.cropId &&
        event.price === cropEvent.price &&
        event.autoplant === cropEvent.autoplant &&
        (ignoreHarvestDate ||
          isEqual(event.firstHarvestDate, cropEvent.firstHarvestDate)),
    );
  }

  return cropEvents.findIndex((event) => event.cropId === cropEvent.cropId);
};

/**
 * Reduces the amount of crops planted or harvested on a date,
 * deleting it if it goes to zero.
 * @param amount The amount to reduce by.
 * @param cropEvent The crop to reduce.
 * @param cropEvents The list of crop events to find the crop in.
 * @param eventType The type of crop to reduce.
 */
export const reduceAmountOfCropInEvent = (
  amount: number,
  cropEvent: StoredCropEvent,
  cropEvents: StoredCropEvent[] = [],
  eventType: CropEventType,
): boolean => {
  if (!cropEvents?.length) {
    return false;
  }

  const index = findEventIndexByCropEvent(cropEvent, cropEvents, eventType, {
    ignoreHarvestDate: true,
  });
  if (index < 0) {
    return false;
  }

  cropEvents[index].amount -= amount;
  if (cropEvents[index].amount <= 0) {
    cropEvents.splice(index, 1);
  }
  return true;
};

/**
 * Removes harvest and plant events on a day based on a base plant event.
 * @param cropEvent The base plant event.
 * @param date The date to update.
 * @param schedule The full schedule.
 * @param harvestOnly Whether to only remove harvest events.
 */
export const removeEventsOnDateByPlantEvent = (
  cropEvent: ReadonlyDeep<CropEvent>,
  date: CalendarDate,
  schedule: Schedule,
  { onlyRemoveHarvest = false }: { onlyRemoveHarvest?: boolean } = {},
): boolean => {
  const daySchedule = schedule[date.year]?.[date.season]?.[date.day];
  console.log(date, daySchedule);
  if (!daySchedule) {
    return false;
  }

  let updatesMade = reduceAmountOfCropInEvent(
    cropEvent.amount,
    cropEvent,
    daySchedule.harvests,
    CropEventTypes.Harvest,
  );

  if (!onlyRemoveHarvest && cropEvent.autoplant) {
    updatesMade =
      reduceAmountOfCropInEvent(
        cropEvent.amount,
        cropEvent,
        daySchedule.plants,
        CropEventTypes.Plant,
      ) || updatesMade;
  }

  return updatesMade;
};

/**
 * Adds a crop event to a day schedule.
 * @param cropEvent The crop event to add.
 * @param existingSchedule The existing day schedule.
 * @returns The updated day schedule.
 */
export const getUpdatedDaySchedule = (
  cropEvent: StoredCropEvent,
  existingSchedule?: DaySchedule,
): DaySchedule => {
  if (!existingSchedule) {
    return { [cropEvent.type]: [cropEvent] };
  }

  const events = [...(existingSchedule[cropEvent.type] ?? [])];
  const existingEventIndex = findEventIndexByCropEvent(
    cropEvent,
    events,
    cropEvent.type,
  );
  if (existingEventIndex >= 0) {
    events[existingEventIndex].amount += cropEvent.amount;
  } else {
    events.push(cropEvent);
  }

  return {
    ...existingSchedule,
    [cropEvent.type]: events,
  };
};

/**
 * Gets the next valid plantable day, if it exists.
 * @param plantDate The date the seed was planted.
 * @param crop The plan
 * @returns The next season.
 */
const getNextPlantableDate = (
  plantDate: CalendarDate,
  crop: ReadonlyDeep<Crop>,
  {
    untilYear,
    growthDay,
    forRegrow,
  }: { untilYear: number; growthDay?: number; forRegrow?: boolean },
) => {
  const harvestDay = getHarvestDay({
    day: plantDate.day,
    growthDay,
    daysToGrow: forRegrow ? crop.daysToRegrow : crop.daysToGrow,
  });

  if (harvestDay < DAYS_IN_SEASON) {
    return { ...plantDate, day: harvestDay };
  }

  const nextDate = {
    ...plantDate,
    day: harvestDay - DAYS_IN_SEASON,
    season: SeasonValues[SeasonIds[plantDate.season] + 1],
  };

  if (!nextDate.season) {
    nextDate.year++;
    nextDate.season = SeasonValues[0];
  }

  if (!crop.seasons.includes(nextDate.season) || nextDate.year > untilYear) {
    return undefined;
  }

  return nextDate;
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
  { cropId, amount, seedPrice, autoplant }: PlantFormFields,
  schedule: Schedule,
) => {
  setScheduleOnDate(
    date,
    schedule,
    getUpdatedDaySchedule(
      {
        type: CropEventTypes.Plant,
        cropId,
        amount,
        price: seedPrice,
        firstHarvestDate,
        ...(autoplant ? { autoplant } : {}),
      },
      getScheduleForYear(date.year, schedule)[date.season][date.day],
    ),
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
  { cropId, growthDay, amount, untilYear }: PlantFormFields,
  schedule: Schedule,
  forRegrow = false,
): CalendarDate | undefined => {
  const crop = CROPS_BY_ID[cropId];
  const nextDate = getNextPlantableDate(date, crop, {
    untilYear: untilYear ?? date.year + 1,
    growthDay,
    forRegrow,
  });
  if (!nextDate) {
    return;
  }

  setScheduleOnDate(
    nextDate,
    schedule,
    getUpdatedDaySchedule(
      {
        type: CropEventTypes.Harvest,
        cropId,
        amount,
        price: crop.sellPrice,
      },
      getScheduleForYear(nextDate.year, schedule)[nextDate.season][
        nextDate.day
      ],
    ),
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

/**
 * Remove a plant event from the schedule.
 * @param date The date the seeds were planted.
 * @param cropEvent The plant event to remove.
 * @param schedule The full schedule.
 */
export const removePlantEvent = (
  date: CalendarDate,
  cropEvent: ReadonlyDeep<CropEvent>,
  schedule: Schedule,
): void => {
  const index = findEventIndexByCropEvent(
    cropEvent,
    schedule[date.year]?.[date.season]?.[date.day]?.plants,
    CropEventTypes.Plant,
  );
  if (index < 0) {
    return;
  }

  schedule[date.year]![date.season]![date.day]!.plants!.splice(index, 1);
};

/**
 * Removes all harvest and plant events associated with the plant event.
 * @param startDate The date to start removing regrow events.
 * @param cropEvent The plant event to remove.
 * @param schedule The full schedule.
 */
export const removeAllRegrowEventsByPlantEvent = (
  startDate: CalendarDate,
  cropEvent: ReadonlyDeep<CropEvent>,
  schedule: Schedule,
): void => {
  const crop = CROPS_BY_ID[cropEvent.cropId];
  let currentDate: CalendarDate | undefined = startDate;
  let updatesMade = true;

  while (updatesMade && currentDate) {
    updatesMade = removeEventsOnDateByPlantEvent(
      cropEvent,
      currentDate,
      schedule,
    );
    currentDate = getNextPlantableDate(currentDate, crop, {
      forRegrow: !cropEvent.autoplant,
      untilYear: currentDate.year + 1,
    });
  }
};

/**
 * Removes all crop events associated with the plant event.
 * @param date The date of the plant event.
 * @param cropEvent The plant event to remove.
 * @param schedule The full schedule.
 * @returns The updated schedule, or an error if one occurred.
 */
export const removeAllCropEvents = (
  date: CalendarDate,
  cropEvent: ReadonlyDeep<CropEvent>,
  schedule: Schedule,
): { schedule?: Schedule; error?: string } => {
  if (cropEvent.type !== CropEventTypes.Plant || !cropEvent.firstHarvestDate) {
    return {
      error: 'You cannot remove a harvest event directly.',
    };
  }

  const crop = CROPS_BY_ID[cropEvent.cropId];
  if (crop.daysToRegrow || cropEvent.autoplant) {
    removeAllRegrowEventsByPlantEvent(
      cropEvent.firstHarvestDate,
      cropEvent,
      schedule,
    );
  } else {
    removeEventsOnDateByPlantEvent(
      cropEvent,
      cropEvent.firstHarvestDate,
      schedule,
      { onlyRemoveHarvest: true },
    );
  }

  removePlantEvent(date, cropEvent, schedule);
  return { schedule };
};
