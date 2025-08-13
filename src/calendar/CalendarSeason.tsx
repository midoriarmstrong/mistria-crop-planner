import { DAYS_IN_SEASON_GROUPED_BY_WEEK } from '../constants/calendar-constants';
import { DaysOfTheWeek } from '../constants/enums/DaysOfTheWeek';
import { Box } from '@mui/material';
import CalendarSeasonDay from './CalendarSeasonDay';
import type { Season } from '../constants/enums/Seasons';

export default function CalendarSeason({
  season,
  hidden,
}: {
  season: Season;
  hidden: boolean;
}) {
  return (
    <Box
      role="tabpanel"
      hidden={hidden}
      className="calendar-season"
      id={`tabpanel-${season}`}
      aria-labelledby={`tab-${season}`}
    >
      <Box className="calendar-season-header">
        <h3>{season}</h3>
      </Box>
      <Box className="calendar-days-of-week-header">
        {Object.keys(DaysOfTheWeek).map((dayOfTheWeek) => (
          <h3 key={`calendar-${season}-day-of-week-${dayOfTheWeek}`}>
            {dayOfTheWeek}
          </h3>
        ))}
      </Box>
      <Box className="calendar-days">
        {DAYS_IN_SEASON_GROUPED_BY_WEEK.map((week, i) => (
          <Box key={`calendar-${season}-week-${i}`}>
            {week.map((day) => (
              <CalendarSeasonDay
                key={`calendar-${season}-day-${day}`}
                day={day}
              />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
