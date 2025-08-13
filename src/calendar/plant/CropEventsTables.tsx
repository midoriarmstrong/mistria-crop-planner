import type { ReadonlyDeep } from 'type-fest';
import type { CropEvent } from '../../types/CropEvent';
import { CROPS_BY_ID } from '../../constants/tables/Crops';
import type { CropEventTableColumn } from './CropEventsTable';
import CropEventsTable from './CropEventsTable';
import { CropEventTypes } from '../../constants/enums/CropEventType';
import { Box } from '@mui/material';
import { IconImage } from '../IconImage';

const CROP_EVENT_COLUMNS: CropEventTableColumn[] = [
  {
    label: 'Crop',
    getValue: (event) => (
      <IconImage icon={event.icon} name={event.name}>
        <span>
          {`${CROPS_BY_ID[event.cropId].name} `}
          <strong>{`x${event.amount}`}</strong>
        </span>
      </IconImage>
    ),
  },
] as const;

const PLANT_COLUMNS: CropEventTableColumn[] = [
  ...CROP_EVENT_COLUMNS,
  {
    label: 'Regrows?',
    getValue: (event) => {
      if (CROPS_BY_ID[event.cropId].daysToRegrow) {
        return '✅';
      }

      if (event.autoplant) {
        return '✅ (Replanted)';
      }

      return '❌';
    },
  },
  {
    label: 'Cost',
    getValue: (event) =>
      event.price ? `-${event.price * event.amount}t` : 'Free',
  },
  {
    label: 'Harvest Day',
    getValue: (event) =>
      event.firstHarvestDate != undefined
        ? `Day ${event.firstHarvestDate.day + 1} of ${event.firstHarvestDate.season}, Year ${event.firstHarvestDate.year + 1}`
        : '',
  },
] as const;

const HARVEST_COLUMNS: CropEventTableColumn[] = [
  ...CROP_EVENT_COLUMNS,
  {
    label: 'Profit',
    getValue: (event) => `+${event.price * event.amount}t`,
  },
] as const;

export default function CropEventsTables({
  dayRevenue,
  harvests,
  plants,
  onUnplant,
}: {
  dayRevenue: string;
  harvests: ReadonlyDeep<CropEvent[]>;
  plants: ReadonlyDeep<CropEvent[]>;
  onUnplant: (event: ReadonlyDeep<CropEvent>) => void;
}) {
  return (
    <Box className="crop-events-tables-container">
      {plants.length > 0 && (
        <CropEventsTable
          type={CropEventTypes.Plant}
          title={`🌱 Crops Planted (${plants.length})`}
          columns={PLANT_COLUMNS}
          onUnplant={onUnplant}
          events={plants}
        />
      )}
      {harvests.length > 0 && (
        <CropEventsTable
          type={CropEventTypes.Harvest}
          title={`🚜 Crops Harvested (${harvests.length})`}
          columns={HARVEST_COLUMNS}
          events={harvests}
        />
      )}
      <Box sx={{ float: 'right' }}>
        <strong>
          Total {dayRevenue.startsWith('-') ? 'Cost' : 'Profit'}:{' '}
        </strong>
        <span>{dayRevenue}</span>
      </Box>
    </Box>
  );
}
