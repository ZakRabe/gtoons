import { ThemeProvider } from '@material-ui/core';
import React from 'react';
import Routes from '../Routes';
import theme from '../utils/theme';
import './App.css';
import AppHeader from './AppHeader';

const App: React.FC = () => {
  const App = () => (
    <>
      <AppHeader />
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
