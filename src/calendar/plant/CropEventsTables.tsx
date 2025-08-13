import type { ReadonlyDeep } from 'type-fest';
import type { CropEvent } from '../../types/CropEvent';
import { CROPS_BY_ID } from '../../constants/tables/Crops';
import type { CropEventTableColumn } from './CropEventsTable';
import CropEventsTable from './CropEventsTable';
import { CropEventTypes } from '../../constants/enums/CropEventType';
import { Alert, Box } from '@mui/material';
import { IconImage } from '../IconImage';
import { useContextWithDefault } from '../../util/context-util';
import { FarmContext, getDefaultFarmContext } from '../contexts/FarmContext';
import { getTotalAmount } from '../../util/stats-util';

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
    label: 'Total Revenue',
    getValue: (event) =>
      event.totalRevenue
        ? `${event.totalRevenue * event.amount}t`
        : 'N/A (Replanted)',
  },
  {
    label: 't/day',
    getValue: (event) =>
      event.revenuePerDay
        ? `${Math.round(event.revenuePerDay * event.amount * 100) / 100}t`
        : 'N/A (Replanted)',
  },
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
  const [farm, setFarm] = useContextWithDefault(
    FarmContext,
    getDefaultFarmContext(),
  );
  const handleSetAcknowledged = () =>
    setFarm({
      ...farm,
      acknowledged: {
        ...(farm.acknowledged ?? {}),
        totalRevenueInformation: true,
      },
    });

  return (
    <Box className="crop-events-tables-container">
      {!farm.acknowledged?.totalRevenueInformation && (
        <Alert
          variant="filled"
          severity="info"
          sx={{ margin: '0.5rem 0' }}
          onClose={handleSetAcknowledged}
        >
          The total revenue for a crop is the profit of all of its harvests
          (including when it regrows or is auto-replanted), minus the cost of
          all of its seeds.
        </Alert>
      )}
      {plants.length > 0 && (
        <CropEventsTable
          type={CropEventTypes.Plant}
          title={`🌱 Crops Planted (${getTotalAmount(plants)})`}
          columns={PLANT_COLUMNS}
          onUnplant={onUnplant}
          events={plants}
        />
      )}
      {harvests.length > 0 && (
        <CropEventsTable
          type={CropEventTypes.Harvest}
          title={`🚜 Crops Harvested (${getTotalAmount(harvests)})`}
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
