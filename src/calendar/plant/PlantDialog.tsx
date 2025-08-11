import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import type { Season } from '../../constants/enums/Seasons';
import type { CropEvent } from '../../types/CropEvent';
import type { ReadonlyDeep } from 'type-fest';
import './PlantDialog.css';
import CropEventsTable from './CropEventsTable';
import PlantDialogForm, { type PlantFormFields } from './PlantDialogForm';
import { useContextWithDefault } from '../../util/context-util';
import { DEFAULT_FARM_CONTEXT, FarmContext } from '../contexts/FarmContext';
import { ScheduleContext } from '../contexts/ScheduleContext';
import cloneDeep from 'lodash/cloneDeep';
import { EMPTY_YEAR_SCHEDULE } from '../../constants/calendar-constants';
import { addAllCropEvents } from '../../util/schedule-util';

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
  const [schedule, setSchedule] = useContextWithDefault(ScheduleContext, []);
  const [farm] = useContextWithDefault(FarmContext, DEFAULT_FARM_CONTEXT);

  const handlePlant = (fields: PlantFormFields) => {
    console.log('Handling plant');
    const newSchedule = [...schedule];
    const currentYear = farm.currentYear ?? 0;
    newSchedule[currentYear] = addAllCropEvents(
      day,
      season,
      fields,
      newSchedule[currentYear] ?? cloneDeep(EMPTY_YEAR_SCHEDULE),
    );
    console.log(newSchedule);
    setSchedule(newSchedule);
  };

  const handleSave = () => {
    return onClose();
  };

  return (
    <Dialog fullWidth maxWidth={'xl'} onClose={onClose} open={open}>
      <DialogTitle>
        Day {day} of {season}
      </DialogTitle>
      <DialogContent>
        <PlantDialogForm season={season} onPlant={handlePlant} />
        <CropEventsTable harvests={harvests} plants={plants} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleSave}>Done</Button>
      </DialogActions>
    </Dialog>
  );
}
