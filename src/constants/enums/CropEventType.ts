import type { ValueOf } from 'type-fest';

export const CropEventTypes = {
  Plant: 'plants',
  Harvest: 'harvests',
} as const;

export type CropEventType = ValueOf<typeof CropEventTypes>;
