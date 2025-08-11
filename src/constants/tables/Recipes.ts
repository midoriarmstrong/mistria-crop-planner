import keyBy from 'lodash/keyBy';
import { RecipeTypes } from '../enums/RecipeTypes';
import type { ReadonlyDeep } from 'type-fest';
import type { Recipe } from '../../types/Recipe';

export const RECIPES: ReadonlyDeep<Recipe[]> = [
  {
    id: 'Grilled Corn',
    name: 'Grilled Corn',
    sellPrice: 135,
    type: RecipeTypes.Cooking,
    ingredients: {
      Corn: 1,
    },
  },
  {
    id: 'Summer Salad',
    name: 'Summer Salad',
    sellPrice: 430,
    type: RecipeTypes.Cooking,
    ingredients: {
      Cucumber: 1,
      'Chili Pepper': 1,
      Tomato: 1,
      Corn: 1,
    },
  },
  {
    id: 'Faux Corn',
    name: 'Faux Corn',
    sellPrice: 550,
    type: RecipeTypes.Crafting,
    ingredients: {
      Corn: 4,
    },
  },
  {
    id: 'Corn Sign',
    name: 'Corn Sign',
    sellPrice: 160,
    type: RecipeTypes.Crafting,
    ingredients: {
      Wood: 10,
      Corn: 1,
    },
  },
];

export const RECIPES_BY_ID = keyBy(RECIPES, 'id');
