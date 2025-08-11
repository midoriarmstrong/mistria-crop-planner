import { Box, Tab, Tabs } from '@mui/material';
import { Seasons } from '../constants/enums/Seasons';
import { useState } from 'react';
import CalendarSeasonTabPanel from './CalendarSeasonTabPanel';
import './Calendar.css';
import { LocalStorageKeys } from '../constants/enums/LocalStorageKeys';
import { ScheduleContext } from './contexts/ScheduleContext';
import type { Schedule } from '../types/Schedule';
import { useLocalStorageWithDefault } from '../util/context-util';
import { FarmContext } from './contexts/FarmContext';
import type { Farm } from '../types/Farm';
import { ICONS_BY_SEASON } from '../constants/icon-constants';
import CalendarHeader from './CalendarHeader';

export default function Calendar() {
  const [selectedSeasonId, setSelectedSeasonId] = useState(0);
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedSeasonId(newValue);
  };

  const scheduleHookValue = useLocalStorageWithDefault<Schedule>(
    LocalStorageKeys.Schedule,
    [],
  );
  const farmHookValue = useLocalStorageWithDefault<Farm>(
    LocalStorageKeys.Farm,
    {},
  );

  return (
    <Box className="calendar">
      <FarmContext value={farmHookValue}>
        <ScheduleContext value={scheduleHookValue}>
          <CalendarHeader
            selectedSeasonId={selectedSeasonId}
            setSelectedSeasonId={setSelectedSeasonId}
          />
          <Box className="calendar-seasons">
            <Tabs
              value={selectedSeasonId}
              onChange={handleChange}
              aria-label="Calendar season selector"
              variant="scrollable"
              allowScrollButtonsMobile
            >
              {Object.values(Seasons).map((season) => (
                <Tab
                  key={`calendar-season-tab-${season}`}
                  icon={<img src={ICONS_BY_SEASON[season]} height="20px" />}
                  label={season}
                  id={`tab-${season}`}
                  aria-controls={`tabpanel-${season}`}
                />
              ))}
            </Tabs>
          </Box>
          {Object.values(Seasons).map((season, seasonId) => (
            <CalendarSeasonTabPanel
              key={`calendar-season-tab-panel-${season}`}
              hidden={selectedSeasonId !== seasonId}
              season={season}
            />
          ))}
        </ScheduleContext>
      </FarmContext>
    </Box>
  );
}
