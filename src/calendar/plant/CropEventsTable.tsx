import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import type { ReadonlyDeep } from 'type-fest';
import type { CropEvent } from '../../types/CropEvent';
import {
  CropEventTypes,
  type CropEventType,
} from '../../constants/enums/CropEventType';
import DeleteIcon from '@mui/icons-material/Delete';

export interface CropEventTableColumn {
  label: string;
  getValue: (event: ReadonlyDeep<CropEvent>) => React.ReactNode;
}

export default function CropEventsTable({
  onUnplant,
  title,
  columns,
  events,
  type,
}: {
  title: string;
  onUnplant?: (event: ReadonlyDeep<CropEvent>) => void;
  columns: CropEventTableColumn[];
  events: ReadonlyDeep<CropEvent[]>;
  type: CropEventType;
}) {
  return (
    <TableContainer component={Box} className="crop-event-table-container">
      <Table aria-label={`${title} Table`} size="small">
        <TableHead>
          <TableRow>
            <TableCell colSpan={7} align="center">
              <h3>{title}</h3>
            </TableCell>
          </TableRow>
          <TableRow>
            {columns.map(({ label }) => (
              <TableCell key={`${type}-header-${label}`}>{label}</TableCell>
            ))}
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event, i) => (
            <TableRow key={`${type}-${event.cropId}-${i}`}>
              {columns.map(({ label, getValue }) => (
                <TableCell key={`${type}-cell-${i}-${label}`}>
                  {getValue(event)}
                </TableCell>
              ))}
              {type === CropEventTypes.Plant && event.totalRevenue && (
                <TableCell>
                  <IconButton
                    aria-label="Delete"
                    onClick={() => onUnplant?.(event)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
