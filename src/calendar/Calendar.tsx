import { Box, Tab, Tabs } from '@mui/material';
import { Seasons } from '../enums/Seasons';
import { useState } from 'react';
import CalendarSeasonTabPanel from './CalendarSeasonTabPanel';
import springLogo from '../assets/seasons/spring.png';
import summerLogo from '../assets/seasons/summer.png';
import fallLogo from '../assets/seasons/fall.png';
import winterLogo from '../assets/seasons/winter.png';
import './Calendar.css';

const LOGOS_BY_SEASON = {
  [Seasons.Spring]: springLogo,
  [Seasons.Summer]: summerLogo,
  [Seasons.Fall]: fallLogo,
  [Seasons.Winter]: winterLogo,
};

export default function Calendar() {
  const [selectedSeasonId, setSelectedSeasonId] = useState(0);
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedSeasonId(newValue);
  };

  return (
    <Box className="calendar">
      <Box className="calendar-header"></Box>
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
              icon={<img src={LOGOS_BY_SEASON[season]} height="20px" />}
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
    </Box>
  );
}
