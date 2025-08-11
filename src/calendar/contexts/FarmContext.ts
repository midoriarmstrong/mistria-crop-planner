import { createContext } from 'react';
import type { Farm } from '../../types/Farm';
import type { HookContextValue } from '../../types/HookContextValue';

export const FarmContext = createContext<HookContextValue<Farm> | undefined>(
  undefined,
);

export const getDefaultFarmContext = () => ({ currentYear: 0 });
