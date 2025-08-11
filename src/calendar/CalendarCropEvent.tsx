import { Box } from '@mui/material';
import type { CropEvent } from '../types/CropEvent';
import type { ReadonlyDeep } from 'type-fest';

export default function CalendarCropEvent({
  cropEvent: { icon, name, amount },
}: {
  cropEvent: ReadonlyDeep<CropEvent>;
}) {
  return (
    <Box>
      <img src={icon} alt={`Icon from ${name}`} />
      <span>x{amount}</span>
    </Box>
  );
}
