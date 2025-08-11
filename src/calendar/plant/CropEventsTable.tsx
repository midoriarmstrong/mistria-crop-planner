// import { useState } from 'react';
// import type { InputChangeEvent } from '../../types/ChangeEvents';
import { Table } from '@mui/material';
import type { ReadonlyDeep } from 'type-fest';
import type { CropEvent } from '../../types/CropEvent';

export default function CropEventsTable({
  harvests,
  plants,
}: {
  harvests: ReadonlyDeep<CropEvent[]>;
  plants: ReadonlyDeep<CropEvent[]>;
}) {
  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(10);
  // const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  // const handleChangeRowsPerPage = (event: InputChangeEvent) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  console.log(harvests, plants);
  return <Table></Table>;
}
