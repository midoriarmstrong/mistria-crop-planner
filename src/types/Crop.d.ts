import type { Season } from '../constants/enums/Seasons';

export interface Crop {
  id: string;
  name: string;
  seasons: Season[];
  sellPrice: number;
  buyPrices: number[];
  daysToGrow: number;
  daysToRegrow?: number;
  recipeIds?: string[];
}
