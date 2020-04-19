import '@fortawesome/fontawesome-free/css/all.css';
import React, { useState } from 'react';
import 'semantic-ui-css/semantic.min.css';
import UserContext from '../contexts/UserContext';
import Routes from '../Routes';
import './App.css';
import AppHeader from './AppHeader';

const App: React.FC = () => {
  const [user, setUser] = useState(null);

  const App = () => (
    <section id="App-wrapper">
      <UserContext.Provider value={{ user, setUser }}>
        <AppHeader />
        <Routes />
      </UserContext.Provider>
    </section>
  );
  return <App />;
};

export default App;
