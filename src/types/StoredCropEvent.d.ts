import type { CropEventType } from '../constants/enums/CropEventType';
import type { CalendarDate } from './CalendarDate';

export interface StoredCropEvent {
  /**
   * Whether this is a plant or harvest event.
   */
  type: CropEventType;

  /**
   * The ID of the crop being planted or harvested.
   */
  cropId: string;

  /**
   * The number of crops being planted or harvested.
   */
  amount: number;

  /**
   * The cost of planting, or the profit from harvesting, a single crop.
   */
  price: number;

  /**
   * Whether the crop event was created as part of an autoplant request.
   */
  autoplant?: boolean;

  /**
   * For Plant crop events, the day the crop is first harvested.
   */
  firstHarvestDate?: CalendarDate;
}
