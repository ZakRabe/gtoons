import '@fortawesome/fontawesome-free/css/all.css';
import React, { useState } from 'react';
import 'semantic-ui-css/semantic.min.css';
import UserContext from '../contexts/UserContext';
import Routes from '../Routes';
import './App.css';
import AppHeader from './AppHeader';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import GoogleAnalytics from '../components/GoogleAnalytics/GoogleAnalytics';

const App: React.FC = () => {
  const [user, setUser] = useState(null);

  const App = () => (
    <section id="App-wrapper">
      <GoogleAnalytics />
      <GoogleReCaptchaProvider reCaptchaKey="6LejO84ZAAAAAEouoFO5rDK4nD1M0dlQEdFMTm5j">
        <UserContext.Provider value={{ user, setUser }}>
          <AppHeader />
          <Routes />
        </UserContext.Provider>
      </GoogleReCaptchaProvider>
    </section>
  );
  return <App />;
};

export default App;
