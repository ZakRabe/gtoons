import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Play from '../pages/Play';
import Game from '../pages/Game';



const App: React.FC = () => {

  const App = () => (
    <div>
      <h1>GToons</h1>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/profile' component={Profile} />
        <Route path='/play' component={Play} />
        <Route path='/game' component={Game} />
      </Switch>
    </div>
  )
  return (
    <Switch>
      <App />
    </Switch>
  );
}

export default App;
