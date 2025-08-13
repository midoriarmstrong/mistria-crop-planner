import { Box, Button, IconButton } from '@mui/material';
import { useContextWithDefault } from '../util/context-util';
import { getDefaultFarmContext, FarmContext } from './contexts/FarmContext';
import { SeasonValues } from '../constants/enums/Seasons';
import { getNextSeasonIdAndYear } from '../util/schedule-util';
import BackIcon from '@mui/icons-material/ArrowBackIosNew';
import NextIcon from '@mui/icons-material/ArrowForwardIos';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import {
  getDefaultScheduleContext,
  ScheduleContext,
} from './contexts/ScheduleContext';
import { useState } from 'react';
import DownIcon from '@mui/icons-material/KeyboardArrowDown';
import UpIcon from '@mui/icons-material/KeyboardArrowUp';
import SettingsIcon from '@mui/icons-material/Settings';

export default function CalendarHeader({
  selectedSeasonId,
  setSelectedSeasonId,
}: {
  selectedSeasonId: number;
  setSelectedSeasonId: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [showSettings, setShowSettings] = useState(false);
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

  const handleShowSettings = () => setShowSettings(!showSettings);

  return (
    <Box className="calendar-header">
      <Box className="calendar-nav">
        <IconButton
          sx={{ opacity: previousDate ? 1 : 0 }}
          aria-label="Previous Season"
          onClick={handleBack}
          disabled={!previousDate}
        >
          <BackIcon />
        </IconButton>
        <h2>
          {currentSeason}, Year {currentYear + 1}
        </h2>
        {nextDate && (
          <IconButton
            sx={{ opacity: nextDate ? 1 : 0 }}
            aria-label="Next Season"
            onClick={handleNext}
          >
            <NextIcon />
          </IconButton>
        )}
      </Box>
      <Box className="calendar-controls">
        <Button
          onClick={handleShowSettings}
          startIcon={<SettingsIcon />}
          endIcon={showSettings ? <UpIcon /> : <DownIcon />}
        >
          Settings
        </Button>
        <Box
          className="calendar-settings"
          sx={{
            maxHeight: showSettings ? '200px' : '0rem',
          }}
        >
          <Button
            onClick={handleClearSeason}
            variant="contained"
            startIcon={<CalendarMonthIcon />}
          >
            Clear Season
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
    </Box>
  );
}
