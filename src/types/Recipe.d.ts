import type { RecipeType } from '../constants/enums/RecipeTypes';

export interface Recipe {
  id: string;
  name: string;
  type: RecipeType;
  sellPrice: number;
  ingredients: Record<string, number>;
}
