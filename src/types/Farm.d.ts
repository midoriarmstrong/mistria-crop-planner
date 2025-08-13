import type { FarmLocation } from '../constants/enums/FarmLocations';
import type { CalendarDate } from './CalendarDate';

export interface Farm {
  currentDate: CalendarDate;
  location: FarmLocation;
  acknowledged?: {
    cropInformation?: boolean;
    totalRevenueInformation?: boolean;
  };
}
