import type { ValueOf } from 'type-fest';

export const FarmLocations = {
  Farm: 'Farm',
} as const;

export type FarmLocation = ValueOf<typeof FarmLocations>;
