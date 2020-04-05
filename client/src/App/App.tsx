import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import Routes from '../Routes';
import './App.css';
import AppHeader from './AppHeader';
import AppMenu from './AppMenu';

const App: React.FC = () => {
  const App = () => (
    <>
      <section style={{ display: 'flex' }}>
        <AppHeader />
        <Routes />
      </section>
    </>
  );
  return <App />;
};

export default App;
