import { ThemeProvider } from '@material-ui/core';
import React from 'react';
import Routes from '../Routes';
import theme from '../utils/theme';
import './App.css';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Play from '../pages/Play';
import Game from '../pages/Game';

const App: React.FC = () => {
  const App = () => (
    <>
      <h1 style={{ marginTop: 0 }}>GToons</h1>
      <Routes />
    </>
  );
  return (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
};

export default App;
