import { Box } from '@mui/material';
import { useState } from 'react';
import PlantDialog from './plant/PlantDialog';
import { useContextWithDefault } from '../util/context-util';
import { ScheduleContext } from './ScheduleContext';
import type { Season } from '../constants/enums/Seasons';

export default function CalendarSeasonDay({
  day,
  season,
}: {
  day: number;
  season: Season;
}) {
  const [open, setOpen] = useState(false);
  const [schedule, setSchedule] = useContextWithDefault(ScheduleContext, []);
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
