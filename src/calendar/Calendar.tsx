import { Box, Tab, Tabs } from '@mui/material';
import { SeasonIds, SeasonValues, Seasons } from '../constants/enums/Seasons';
import CalendarSeasonTabPanel from './CalendarSeasonTabPanel';
import './Calendar.css';
import { LocalStorageKeys } from '../constants/enums/LocalStorageKeys';
import {
  ScheduleContext,
  getDefaultScheduleContext,
} from './contexts/ScheduleContext';
import type { Schedule } from '../types/Schedule';
import { useLocalStorageWithDefault } from '../util/context-util';
import { FarmContext, getDefaultFarmContext } from './contexts/FarmContext';
import type { Farm } from '../types/Farm';
import { ICONS_BY_SEASON } from '../constants/icon-constants';
import CalendarHeader from './CalendarHeader';
import { IconImage } from './IconImage';

export default function Calendar() {
  const farmHookValue = useLocalStorageWithDefault<Farm>(
    LocalStorageKeys.Farm,
    getDefaultFarmContext(),
  );
  const [farm, setFarm] = farmHookValue;
  const handleSeasonChange = (
    _event: React.SyntheticEvent,
    newValue: number,
  ) => {
    setFarm({
      ...farm,
      currentDate: {
        ...farm.currentDate,
        season: SeasonValues[newValue],
      },
    });
  };

  const scheduleHookValue = useLocalStorageWithDefault<Schedule>(
    LocalStorageKeys.Schedule,
    getDefaultScheduleContext(),
  );

  return (
    <Box className="calendar">
      <FarmContext value={farmHookValue}>
        <ScheduleContext value={scheduleHookValue}>
          <CalendarHeader />
          <Box className="calendar-seasons">
            <Tabs
              value={SeasonIds[farm.currentDate.season]}
              onChange={handleSeasonChange}
              aria-label="Calendar season selector"
              variant="scrollable"
              allowScrollButtonsMobile
            >
              {Object.values(Seasons).map((season) => (
                <Tab
                  key={`calendar-season-tab-${season}`}
                  icon={
                    <IconImage icon={ICONS_BY_SEASON[season]} name={season}>
                      <span className="calendar-tab-label">{season}</span>
                    </IconImage>
                  }
                  id={`tab-${season}`}
                  aria-controls={`tabpanel-${season}`}
                />
              ))}
            </Tabs>
          </Box>
          {Object.values(Seasons).map((season) => (
            <CalendarSeasonTabPanel
              key={`calendar-season-tab-panel-${season}`}
              hidden={farm.currentDate.season !== season}
              season={season}
            />
          ))}
        </ScheduleContext>
      </FarmContext>
    </Box>
  );
}
