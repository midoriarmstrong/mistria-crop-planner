import { useState } from 'react';
import type { InputChangeEvent } from '../../types/ChangeEvents';
import { Table } from '@mui/material';
import type { ReadonlyDeep } from 'type-fest';
import type { CropEvent } from '../../types/CropEvent';

const CROP_EVENT_COLUMNS = [
  {
    id: 'crop',
    label: 'Crop',
  },
  {
    id: 'regrows',
    label: 'Regrows?',
  },
  {
    id: 'amount',
    label: 'Amount',
  },
] as const;

const PLANT_COLUMNS = [
  ...CROP_EVENT_COLUMNS,
  {
    id: 'cost',
    label: 'Cost',
  },
  {
    id: 'harvestDay',
    label: 'Harvest Day',
  },
] as const;

const HARVEST_COLUMNS = [
  ...CROP_EVENT_COLUMNS,
  {
    id: 'profit',
    label: 'Profit',
  },
] as const;

export default function CropEventsTable({
  harvests,
  plants,
}: {
  harvests: ReadonlyDeep<CropEvent[]>;
  plants: ReadonlyDeep<CropEvent[]>;
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: InputChangeEvent) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return <Table></Table>;
}
