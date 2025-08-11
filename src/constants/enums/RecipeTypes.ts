import type { ValueOf } from 'type-fest';

export const RecipeTypes = {
  Cooking: 'Cooking',
  Milling: 'Milling',
  Crafting: 'Crafting',
} as const;

export type RecipeType = ValueOf<typeof RecipeTypes>;
