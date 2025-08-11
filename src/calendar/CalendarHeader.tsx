import { Box, Button, IconButton } from '@mui/material';
import { useContextWithDefault } from '../util/context-util';
import { getDefaultFarmContext, FarmContext } from './contexts/FarmContext';
import { SeasonValues } from '../constants/enums/Seasons';
import { getNextSeasonIdAndYear } from '../util/schedule-util';
import BackIcon from '@mui/icons-material/ArrowBackIos';
import NextIcon from '@mui/icons-material/ArrowForwardIos';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import {
  getDefaultScheduleContext,
  ScheduleContext,
} from './contexts/ScheduleContext';

export default function CalendarHeader({
  selectedSeasonId,
  setSelectedSeasonId,
}: {
  selectedSeasonId: number;
  setSelectedSeasonId: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [schedule, setSchedule] = useContextWithDefault(
    ScheduleContext,
    getDefaultScheduleContext(),
  );
  const [farm, setFarm] = useContextWithDefault(
    FarmContext,
    getDefaultFarmContext(),
  );
  const currentYear = farm.currentYear ?? 0;
  const currentSeason = SeasonValues[selectedSeasonId];
  const nextDate = getNextSeasonIdAndYear(selectedSeasonId, farm.currentYear);
  const previousDate = getNextSeasonIdAndYear(
    selectedSeasonId,
    farm.currentYear,
    true,
  );

  const handleNext = (_event: unknown, backward = false) => {
    const date = backward ? previousDate : nextDate;
    if (!date) {
      return;
    }

    const [nextSeasonId, nextYear] = date;
    setSelectedSeasonId(nextSeasonId);
    if (nextYear !== farm.currentYear) {
      setFarm({ ...farm, currentYear: nextYear });
    }
  };
  const handleBack = (event: unknown) => handleNext(event, true);

  const handleClearSeason = () => {
    const newSchedule = [...schedule];
    if (newSchedule[currentYear]?.[currentSeason]) {
      newSchedule[currentYear][currentSeason] = [];
    }
    setSchedule(newSchedule);
  };

  const handleClearYear = () => {
    const newSchedule = [...schedule];
    delete newSchedule[currentYear];
    setSchedule(newSchedule);
  };

  const handleClearAll = () => {
    setSchedule(getDefaultScheduleContext());
    setFarm({ ...farm, currentYear: 0 });
    setSelectedSeasonId(0);
  };

  const handleClearFarm = () => {
    setSelectedSeasonId(0);
    setFarm(getDefaultFarmContext());
  };

  return (
    <Box className="calendar-header">
      <Box className="calendar-nav">
        {previousDate && (
          <IconButton aria-label="Previous Season" onClick={handleBack}>
            <BackIcon />
          </IconButton>
        )}
        <h1>
          {currentSeason}, Year {currentYear + 1}
        </h1>
        {nextDate && (
          <IconButton aria-label="Next Season" onClick={handleNext}>
            <NextIcon />
          </IconButton>
        )}
      </Box>
      <Box className="calendar-controls">
        <Button
          onClick={handleClearSeason}
          variant="contained"
          startIcon={<CalendarMonthIcon />}
        >
          Clear {currentSeason}
        </Button>
        <Button
          onClick={handleClearYear}
          variant="contained"
          startIcon={<CalendarTodayIcon />}
        >
          Clear Year
        </Button>
        <Button
          onClick={handleClearAll}
          variant="contained"
          startIcon={<EventRepeatIcon />}
        >
          Clear All Years
        </Button>
        <Button
          onClick={handleClearFarm}
          variant="contained"
          startIcon={<AgricultureIcon />}
        >
          Clear Farm Details
        </Button>
      </Box>
    </Box>
  );
}
