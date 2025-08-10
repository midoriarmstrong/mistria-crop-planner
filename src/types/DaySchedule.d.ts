export interface DaySchedule {
  harvests?: {
    cropId: string;
    price: number;
    count: number;
  }[];
  plants?: {
    cropId: string;
    price: number;
    count: number;
  }[];
}
