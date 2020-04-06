import React from "react";
import "semantic-ui-css/semantic.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import Routes from "../Routes";
import "./App.css";
import AppHeader from "./AppHeader";

const App: React.FC = () => {
  const App = () => (
    <section id='App-wrapper'>
      <AppHeader />
      <Routes />
    </section>
  );
  return <App />;
};

export default App;
