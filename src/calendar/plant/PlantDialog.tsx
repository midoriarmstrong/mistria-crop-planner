import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  useMediaQuery,
} from '@mui/material';
import type { CropEvent } from '../../types/CropEvent';
import type { ReadonlyDeep } from 'type-fest';
import './PlantDialog.css';
import CropEventsTables from './CropEventsTables';
import PlantDialogForm, { type PlantFormFields } from './PlantDialogForm';
import { useContextWithDefault } from '../../util/context-util';
import { ScheduleContext } from '../contexts/ScheduleContext';
import {
  addAllCropEvents,
  removeAllCropEvents,
} from '../../util/schedule-util';
import { useState } from 'react';
import type { CalendarDate } from '../../types/CalendarDate';
import { theme } from '../../constants/theme';

export default function PlantDialog({
  date,
  dayRevenue,
  harvests,
  plants,
  open,
  onClose,
}: {
  date: CalendarDate;
  dayRevenue: string;
  harvests: ReadonlyDeep<CropEvent[]>;
  plants: ReadonlyDeep<CropEvent[]>;
  open: boolean;
  onClose: () => void;
}) {
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [schedule, setSchedule] = useContextWithDefault(ScheduleContext, []);
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleErrorClose = () => {
    setErrorMessage(undefined);
  };

  const handlePlant = (fields: PlantFormFields) => {
    const { schedule: newSchedule, error } = addAllCropEvents(date, fields, [
      ...schedule,
    ]);

    if (!newSchedule) {
      return setErrorMessage(
        error ?? 'An unexpected error occurred while planting the crop.',
      );
    }

    setSchedule(newSchedule);
  };

  const handleUnplant = (cropEvent: ReadonlyDeep<CropEvent>) => {
    const { schedule: newSchedule, error } = removeAllCropEvents(
      date,
      cropEvent,
      [...schedule],
    );

    if (!newSchedule) {
      return setErrorMessage(
        error ?? 'An unexpected error occurred while removing the crop.',
      );
    }

    setSchedule(newSchedule);
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth={'xl'}
      onClose={onClose}
      open={open}
    >
      <DialogTitle>
        Day {date.day + 1} of {date.season}, Year {date.year + 1}
      </DialogTitle>
      <DialogContent>
        <PlantDialogForm date={date} onPlant={handlePlant} />
        <CropEventsTables
          dayRevenue={dayRevenue}
          harvests={harvests}
          plants={plants}
          onUnplant={handleUnplant}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleErrorClose}
      >
        <Alert
          onClose={handleErrorClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
