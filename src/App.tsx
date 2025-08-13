import logo from './assets/logo.png';
import Calendar from './calendar/Calendar';
import './App.css';
import { ThemeProvider } from '@mui/material';
import { theme } from './constants/theme';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <header>
        <img src={logo} alt="Fields of Mistria" />
        <h1>Crop Planner v0.1.0</h1>
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
        made available under the MIT License. All included image assets are copyright © NPC Studio or any other respective owners, and are not included under the MIT license of the project code. Assets are used under fair use provisions. No part of this project is for profit. Design based on{' '}
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
