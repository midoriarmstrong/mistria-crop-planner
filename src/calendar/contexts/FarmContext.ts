import { createContext } from 'react';
import type { Farm } from '../../types/Farm';
import type { HookContextValue } from '../../types/HookContextValue';
import { Seasons } from '../../constants/enums/Seasons';
import { FarmLocations } from '../../constants/enums/FarmLocations';

export const FarmContext = createContext<HookContextValue<Farm> | undefined>(
  undefined,
);

export const getDefaultFarmContext = () => ({
  currentDate: { day: 0, season: Seasons.Spring, year: 0 },
  location: FarmLocations.Farm,
});
