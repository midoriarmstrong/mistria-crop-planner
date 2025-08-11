import type { StoredCropEvent } from './StoredCropEvent';

export interface DaySchedule {
  harvests?: StoredCropEvent[];
  plants?: StoredCropEvent[];
}
