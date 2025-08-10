export const Seasons = {
  Spring: 'Spring',
  Summer: 'Summer',
  Fall: 'Fall',
  Winter: 'Winter',
} as const;

export type Season = keyof typeof Seasons;
