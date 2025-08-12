import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import type { ReadonlyDeep } from 'type-fest';
import type { CropEvent } from '../../types/CropEvent';
import { CROPS_BY_ID } from '../../constants/tables/Crops';
import DeleteIcon from '@mui/icons-material/Delete';

const CROP_EVENT_COLUMNS = [
  {
    label: 'Crop',
    getValue: (event: ReadonlyDeep<CropEvent>) =>
      CROPS_BY_ID[event.cropId].name,
  },
  {
    label: 'Amount',
    getValue: (event: ReadonlyDeep<CropEvent>) => `x${event.amount}`,
  },
  {
    label: 'Regrows?',
    getValue: (event: ReadonlyDeep<CropEvent>) =>
      CROPS_BY_ID[event.cropId].daysToRegrow ? '✅' : '❌',
  },
] as const;

const PLANT_COLUMNS = [
  ...CROP_EVENT_COLUMNS,
  {
    label: 'Autoplanted?',
    getValue: (event: ReadonlyDeep<CropEvent>) =>
      event.autoplant ? '✅' : '❌',
  },
  {
    label: 'Cost',
    getValue: (event: ReadonlyDeep<CropEvent>) => `-${event.price}t`,
  },
  {
    label: 'Harvest Day',
    getValue: (event: ReadonlyDeep<CropEvent>) =>
      event.firstHarvestDate != undefined
        ? `Day ${event.firstHarvestDate.day + 1} of ${event.firstHarvestDate.season}, Year ${event.firstHarvestDate.year + 1}`
        : '',
  },
] as const;

const HARVEST_COLUMNS = [
  ...CROP_EVENT_COLUMNS,
  {
    label: 'Profit',
    getValue: (event: ReadonlyDeep<CropEvent>) => `+${event.price}t`,
  },
] as const;

export default function CropEventsTable({
  onUnplant,
  harvests,
  plants,
}: {
  onUnplant: (event: ReadonlyDeep<CropEvent>) => void;
  harvests: ReadonlyDeep<CropEvent[]>;
  plants: ReadonlyDeep<CropEvent[]>;
}) {
  return (
    <TableContainer component={Paper}>
      {plants.length > 0 && (
        <Table aria-label="Planted Crops Table">
          <TableHead>
            <TableRow>
              {PLANT_COLUMNS.map(({ label }) => (
                <TableCell key={`plant-header-${label}`}>{label}</TableCell>
              ))}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plants.map((plant, i) => (
              <TableRow key={`plant-${plant.cropId}-${i}`}>
                {PLANT_COLUMNS.map(({ label, getValue }) => (
                  <TableCell key={`plant-cell-${i}-${label}`}>
                    {getValue(plant)}
                  </TableCell>
                ))}
                <TableCell>
                  <IconButton
                    aria-label="Delete"
                    onClick={() => onUnplant(plant)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {harvests.length > 0 && (
        <Table aria-label="Harvested Crops Table">
          <TableHead>
            <TableRow>
              {HARVEST_COLUMNS.map(({ label }) => (
                <TableCell key={`harvest-header-${label}`}>{label}</TableCell>
              ))}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {harvests.map((harvest, i) => (
              <TableRow key={`harvest-${harvest.cropId}-${i}`}>
                {HARVEST_COLUMNS.map(({ label, getValue }) => (
                  <TableCell key={`harvest-cell-${i}-${label}`}>
                    {getValue(harvest)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
}
