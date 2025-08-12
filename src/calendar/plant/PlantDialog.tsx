import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
} from '@mui/material';
import type { Season } from '../../constants/enums/Seasons';
import type { CropEvent } from '../../types/CropEvent';
import type { ReadonlyDeep } from 'type-fest';
import './PlantDialog.css';
import CropEventsTable from './CropEventsTable';
import PlantDialogForm, { type PlantFormFields } from './PlantDialogForm';
import { useContextWithDefault } from '../../util/context-util';
import { getDefaultFarmContext, FarmContext } from '../contexts/FarmContext';
import { ScheduleContext } from '../contexts/ScheduleContext';
import { addAllCropEvents } from '../../util/schedule-util';
import { useState } from 'react';

export default function PlantDialog({
  day,
  season,
  harvests,
  plants,
  open,
  onClose,
}: {
  day: number;
  season: Season;
  harvests: ReadonlyDeep<CropEvent[]>;
  plants: ReadonlyDeep<CropEvent[]>;
  open: boolean;
  onClose: () => void;
}) {
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [schedule, setSchedule] = useContextWithDefault(ScheduleContext, []);
  const [farm] = useContextWithDefault(FarmContext, getDefaultFarmContext());

  const handleErrorClose = () => {
    setErrorMessage(undefined);
  };

  const handlePlant = (fields: PlantFormFields) => {
    const { schedule: newSchedule, error } = addAllCropEvents(
      { day, season, year: farm.currentYear ?? 0 },
      fields,
      [...schedule],
    );

    if (!newSchedule) {
      return setErrorMessage(
        error ?? 'An unexpected error occurred while planting the crop.',
      );
    }

    setSchedule(newSchedule);
  };

  const handleSave = () => {
    return onClose();
  };

  return (
    <Dialog fullWidth maxWidth={'xl'} onClose={onClose} open={open}>
      <DialogTitle>
        Day {day + 1} of {season}
      </DialogTitle>
      <DialogContent>
        <PlantDialogForm season={season} onPlant={handlePlant} />
        <CropEventsTable harvests={harvests} plants={plants} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleSave}>Done</Button>
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
