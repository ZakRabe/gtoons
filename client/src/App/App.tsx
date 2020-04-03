import { ThemeProvider } from '@material-ui/core';
import React from 'react';
import Routes from '../Routes';
import theme from '../utils/theme';
import './App.css';

const App: React.FC = () => {
  const App = () => (
    <div>
      <h1>GToons</h1>
      <Routes />
    </div>
  );
  return (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
};

export default App;
