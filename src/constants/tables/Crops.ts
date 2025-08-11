import keyBy from 'lodash/keyBy';
import type { Crop } from '../../types/Crop';
import type { ReadonlyDeep } from 'type-fest';
import { Seasons, type Season } from '../enums/Seasons';

export type CropsBySeason = { [season in Season]: ReadonlyDeep<Crop>[] };

export const CROPS: ReadonlyDeep<Crop[]> = [
  {
    id: 'Corn',
    name: 'Corn',
    seasons: [Seasons.Summer],
    sellPrice: 125,
    buyPrices: [300],
    daysToGrow: 5,
    daysToRegrow: 3,
    recipeIds: ['Grilled Corn', 'Summer Salad', 'Faux Corn', 'Corn Sign'],
  },
];

export const CROPS_BY_ID = keyBy(CROPS, 'id');

export const CROPS_BY_SEASON: ReadonlyDeep<CropsBySeason> = CROPS.reduce(
  (cropsBySeason, crop) => {
    crop.seasons.forEach((season) => {
      cropsBySeason[season].push(crop);
    });
    return cropsBySeason;
  },
  Object.values(Seasons).reduce((cropsBySeason, season) => {
    cropsBySeason[season] = [];
    return cropsBySeason;
  }, {} as CropsBySeason),
);
