import { DAYS_IN_SEASON_GROUPED_BY_WEEK } from '../constants/calendar';
import { DaysOfTheWeek } from '../constants/DaysOfTheWeek';
import { Box } from '@mui/material';
import CalendarSeasonDay from './CalendarSeasonDay';
import type { Season } from '../constants/Seasons';

export default function CalendarSeasonTabPanel({
  season,
  hidden,
}: {
  season: Season;
  hidden: boolean;
}) {
  console.log(DAYS_IN_SEASON_GROUPED_BY_WEEK);
  return (
    <Box
      role="tabpanel"
      hidden={hidden}
      className="calendar-season"
      id={`tabpanel-${season}`}
      aria-labelledby={`tab-${season}`}
    >
      <table>
        <thead>
          <tr>
            {Object.keys(DaysOfTheWeek).map((dayOfTheWeek) => (
              <th key={`calendar-${season}-day-of-week-${dayOfTheWeek}`}>
                {dayOfTheWeek}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DAYS_IN_SEASON_GROUPED_BY_WEEK.map((week, i) => (
            <tr key={`calendar-${season}-week-${i}`}>
              {week.map((day) => (
                <CalendarSeasonDay
                  key={`calendar-${season}-day-${day}`}
                  day={day}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}
