import type { CropEvent } from '../types/CropEvent';
import type { ReadonlyDeep } from 'type-fest';
import { IconImage } from './IconImage';

export default function CalendarCropEvent({
  cropEvent: { icon, name, amount },
}: {
  cropEvent: ReadonlyDeep<CropEvent>;
}) {
  return (
    <IconImage icon={icon ?? ''} name={name}>
      <strong>x{amount}</strong>
    </IconImage>
  );
}
