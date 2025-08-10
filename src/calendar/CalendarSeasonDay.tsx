import { Box } from '@mui/material';
import { useState } from 'react';
import PlantDialog from './plant/PlantDialog';

export default function CalendarSeasonDay({ day }: { day: number }) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <td>
      <Box onClick={handleClickOpen}>
        <strong>{day}</strong>
      </Box>
      <PlantDialog day={day} open={open} onClose={handleClose} />
    </td>
  );
}
