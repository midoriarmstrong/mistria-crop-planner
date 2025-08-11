import type { Crop } from './Crop';
import type { StoredCropEvent } from './StoredCropEvent';

export interface CropEvent extends StoredCropEvent, Crop {
  icon?: string;
}
