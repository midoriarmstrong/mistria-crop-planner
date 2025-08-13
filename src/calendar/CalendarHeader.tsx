import { Box, Button, IconButton } from '@mui/material';
import { useContextWithDefault } from '../util/context-util';
import { getDefaultFarmContext, FarmContext } from './contexts/FarmContext';
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
import { ICONS_BY_SEASON } from '../constants/icon-constants';
import { getDateForNextSeason, incrementCurrentDate } from '../util/farm-util';
import { IconImage } from './IconImage';

export default function CalendarHeader() {
  const [showSettings, setShowSettings] = useState(false);
  const [schedule, setSchedule] = useContextWithDefault(
    ScheduleContext,
    getDefaultScheduleContext(),
  );
  const [farm, setFarm] = useContextWithDefault(
    FarmContext,
    getDefaultFarmContext(),
  );
  const nextDate = getDateForNextSeason(farm.currentDate);
  const previousDate = getDateForNextSeason(farm.currentDate, {
    backward: true,
  });

  const handleNext = (_event: unknown, backward = false) => {
    incrementCurrentDate(farm, setFarm, {
      nextDate,
      previousDate,
      backward,
    });
  };
  const handleBack = (event: unknown) => handleNext(event, true);

  const handleClearSeason = () => {
    const newSchedule = [...schedule];
    if (newSchedule[farm.currentDate.year]?.[farm.currentDate.season]) {
      newSchedule[farm.currentDate.year][farm.currentDate.season] = [];
    }
    setSchedule(newSchedule);
  };

  const handleClearYear = () => {
    const newSchedule = [...schedule];
    delete newSchedule[farm.currentDate.year];
    setSchedule(newSchedule);
  };

  const handleClearAll = () => {
    setSchedule(getDefaultScheduleContext());
    setFarm({ ...getDefaultFarmContext() });
  };

  const handleClearFarm = () => {
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
        <Box className="calendar-nav-header">
          <h2>
            <IconImage
              icon={ICONS_BY_SEASON[farm.currentDate.season]}
              name={farm.currentDate.season}
            >
              <span>
                {farm.currentDate.season}, Year {farm.currentDate.year + 1}
              </span>
            </IconImage>
          </h2>
          <h3>{farm.location}</h3>
        </Box>
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
