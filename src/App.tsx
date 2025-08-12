import logo from './assets/logo.png';
import Calendar from './calendar/Calendar';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: '#0e6878',
    },
    secondary: {
      main: '#6ebbe3',
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <header>
        <h1>
          <img src={logo} alt="Fields of Mistria" />
          Crop Planner
        </h1>
      </header>
      <main>
        <Calendar />
      </main>
      <footer>
        <a
          href="https://www.fieldsofmistria.com/"
          target="_blank"
          rel="noreferrer"
        >
          Fields of Mistria
        </a>{' '}
        (v0.14.1) © NPC Studio. Unofficial{' '}
        <a
          href="https://github.com/midoriarmstrong/mistria-crop-planner"
          target="_blank"
          rel="noreferrer"
        >
          crop planner source code
        </a>{' '}
        made available under the MIT License. Design based on{' '}
        <a href="https://github.com/exnil" target="_blank" rel="noreferrer">
          exnil
        </a>
        's{' '}
        <a
          href="https://exnil.github.io/crop_planner/"
          target="_blank"
          rel="noreferrer"
        >
          Stardew Valley crop planner
        </a>
        .
      </footer>
    </ThemeProvider>
  );
}
