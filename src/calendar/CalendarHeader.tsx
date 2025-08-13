import { Alert, Box, Button, IconButton } from '@mui/material';
import { useContextWithDefault } from '../util/context-util';
import { getDefaultFarmContext, FarmContext } from './contexts/FarmContext';
import BackIcon from '@mui/icons-material/ArrowBackIosNew';
import NextIcon from '@mui/icons-material/ArrowForwardIos';
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
import { formatRevenue, getSeasonStatsFromSchedule } from '../util/stats-util';

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
  const handleSetAcknowledged = () =>
    setFarm({
      ...farm,
      acknowledged: { ...(farm.acknowledged ?? {}), cropInformation: true },
    });

  const nextDate = getDateForNextSeason(farm.currentDate);
  const previousDate = getDateForNextSeason(farm.currentDate, {
    backward: true,
  });
  const { numHarvested, numPlanted, revenue } = getSeasonStatsFromSchedule(
    schedule[farm.currentDate.year]?.[farm.currentDate?.season],
  );

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
    setFarm({
      ...farm,
      currentDate: getDefaultFarmContext().currentDate,
    });
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
              <span className="calendar-date-header">
                <span>{farm.currentDate.season}, </span>
                <span>Year {farm.currentDate.year + 1}</span>
              </span>
            </IconImage>
          </h2>
          <h3>{farm.location}</h3>
        </Box>
        <table className="calendar-nav-stats">
          <tbody>
            <tr>
              <td>🌱 Planted</td>
              <td>{numPlanted}</td>
            </tr>
            <tr>
              <td>🚜 Harvested</td>
              <td>{numHarvested}</td>
            </tr>
            <tr>
              <td>💰 Revenue</td>
              <td>{formatRevenue(revenue) ?? '0t'}</td>
            </tr>
          </tbody>
        </table>
        <IconButton
          sx={{ opacity: nextDate ? 1 : 0 }}
          aria-label="Next Season"
          onClick={handleNext}
        >
          <NextIcon />
        </IconButton>
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
        </Box>
      </Box>
      {!farm.acknowledged?.cropInformation && (
        <Alert
          variant="filled"
          severity="info"
          sx={{ marginTop: '0.5rem' }}
          onClose={handleSetAcknowledged}
        >
          To plant a crop, tap or click on a calendar day.
        </Alert>
      )}
    </Box>
  );
}
