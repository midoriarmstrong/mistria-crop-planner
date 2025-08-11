import { Box } from '@mui/material';
import { useState } from 'react';
import PlantDialog from './plant/PlantDialog';
import { useContextWithDefault } from '../util/context-util';
import {
  getDefaultScheduleContext,
  ScheduleContext,
} from './contexts/ScheduleContext';
import type { Season } from '../constants/enums/Seasons';
import { getDefaultFarmContext, FarmContext } from './contexts/FarmContext';
import type { StoredCropEvent } from '../types/StoredCropEvent';
import { CROPS_BY_ID } from '../constants/tables/Crops';
import {
  CROP_ICONS_BY_CROP_ID,
  SEED_ICONS_BY_CROP_ID,
} from '../constants/icon-constants';
import {
  CropEventTypes,
  type CropEventType,
} from '../constants/enums/CropEventType';
import CalendarCropEvent from './CalendarCropEvent';
import type { CropEvent } from '../types/CropEvent';
import type { ReadonlyDeep } from 'type-fest';

/**
 * Loads extra data into the stored crop event from the crops table and icons.
 * @param cropEvents The stored crop events.
 * @param type The type of the crop event.
 * @returns The crop events with extra data.
 */
const loadDataIntoCropEvents = (
  cropEvents: StoredCropEvent[] = [],
  type: CropEventType,
): ReadonlyDeep<CropEvent[]> => {
  return cropEvents
    .filter(({ cropId }) => !!CROPS_BY_ID[cropId])
    .map(({ cropId, amount, price }) => ({
      ...CROPS_BY_ID[cropId],
      cropId,
      amount,
      price,
      icon:
        type === CropEventTypes.Harvest
          ? CROP_ICONS_BY_CROP_ID[cropId]
          : SEED_ICONS_BY_CROP_ID[cropId],
    }));
};

/**
 * Gets the total profit or cost of a set of crop events of the same type.
 * @param cropEvents The crop events to calculate the combined profit or cost for.
 * @returns The total profit or cost.
 */
const getTotalRevenue = (cropEvents: ReadonlyDeep<CropEvent[]>) => {
  return cropEvents.reduce((cost, event) => {
    cost += event.price * event.amount;
    return cost;
  }, 0);
};

/**
 * Formats the revenue into a more readable format.
 * @param revenue The raw revenue to format.
 */
const formatDayRevenue = (revenue: number) => {
  if (revenue === 0) {
    return undefined;
  }

  let formattedRevenue = `${revenue}`;
  if (revenue > 0) {
    formattedRevenue = `+${formattedRevenue}`;
  }
  return `${formattedRevenue}t`;
};

export default function CalendarSeasonDay({
  day,
  season,
}: {
  day: number;
  season: Season;
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [schedule] = useContextWithDefault(
    ScheduleContext,
    getDefaultScheduleContext(),
  );
  const [farm] = useContextWithDefault(FarmContext, getDefaultFarmContext());

  const currentDay = schedule[farm.currentYear ?? 0]?.[season]?.[day] ?? {};
  const harvests = loadDataIntoCropEvents(
    currentDay.harvests,
    CropEventTypes.Harvest,
  );
  const plants = loadDataIntoCropEvents(
    currentDay.plants,
    CropEventTypes.Plant,
  );
  const dayRevenue = getTotalRevenue(harvests) - getTotalRevenue(plants);

  return (
    <td>
      <Box role="button" onClick={handleOpen}>
        <Box>
          {harvests.map((harvest, i) => (
            <CalendarCropEvent
              key={`${season}-${day}-${harvest.cropId}-${i}`}
              cropEvent={harvest}
            />
          ))}
          {plants.map((plant, i) => (
            <CalendarCropEvent
              key={`${season}-${day}-${plant.cropId}-${i}`}
              cropEvent={plant}
            />
          ))}
        </Box>
        <Box>
          {formatDayRevenue(dayRevenue)}
          <strong>{day + 1}</strong>
        </Box>
      </Box>
      <PlantDialog
        day={day}
        season={season}
        harvests={harvests}
        plants={plants}
        open={open}
        onClose={handleClose}
      />
    </td>
  );
}
