import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Home from '../pages/Home';
import Profile from '../pages/Profile';



const App: React.FC = () => {

  const App = () => (
    <div>
      <h1>GToons</h1>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/profile' component={Profile} />
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
