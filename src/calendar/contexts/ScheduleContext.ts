import { createContext } from 'react';
import type { Schedule } from '../../types/Schedule';
import type { HookContextValue } from '../../types/HookContextValue';

export const ScheduleContext = createContext<
  HookContextValue<Schedule> | undefined
>(undefined);

export const getDefaultScheduleContext = () => [];
