import { Box } from '@mui/material';
import { useState } from 'react';
import PlantDialog from './plant/PlantDialog';
import { useContextWithDefault } from '../util/context-util';
import {
  getDefaultScheduleContext,
  ScheduleContext,
} from './contexts/ScheduleContext';
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
import { formatRevenue, getTotalRevenueFromEvents } from '../util/stats-util';

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
    .map((cropEvent) => ({
      ...CROPS_BY_ID[cropEvent.cropId],
      ...cropEvent,
      icon:
        type === CropEventTypes.Harvest
          ? CROP_ICONS_BY_CROP_ID[cropEvent.cropId]
          : SEED_ICONS_BY_CROP_ID[cropEvent.cropId],
    }));
};

export default function CalendarSeasonDay({ day }: { day: number }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [schedule] = useContextWithDefault(
    ScheduleContext,
    getDefaultScheduleContext(),
  );
  const [farm] = useContextWithDefault(FarmContext, getDefaultFarmContext());
  const { season, year } = farm.currentDate;
  const currentDaySchedule = schedule[year]?.[season]?.[day] ?? {};
  const harvests = loadDataIntoCropEvents(
    currentDaySchedule.harvests,
    CropEventTypes.Harvest,
  );
  const plants = loadDataIntoCropEvents(
    currentDaySchedule.plants,
    CropEventTypes.Plant,
  );
  const dayRevenue = formatRevenue(
    getTotalRevenueFromEvents(harvests) - getTotalRevenueFromEvents(plants),
  );
  const events = [...harvests, ...plants];

  return (
    <td>
      <Box role="button" className="calendar-day" onClick={handleOpen}>
        <strong>{day + 1}</strong>
        <Box className="calendar-icon-list">
          {events.slice(0, 7).map((event, i) => (
            <CalendarCropEvent
              key={`${season}-${day}-${event.cropId}-${i}`}
              cropEvent={event}
            />
          ))}
        </Box>
        <Box>{dayRevenue}</Box>
      </Box>
      <PlantDialog
        date={{ day, season, year }}
        dayRevenue={dayRevenue ?? '0t'}
        harvests={harvests}
        plants={plants}
        open={open}
        onClose={handleClose}
      />
    </td>
  );
}
