import { Dialog, DialogTitle } from '@mui/material';

export default function PlantDialog({
  day,
  onClose,
  open,
}: {
  day: number;
  onClose: () => void;
  open: boolean;
}) {
  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Plant new crop on {day}</DialogTitle>
    </Dialog>
  );
}
