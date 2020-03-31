import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Register from '../pages/Register';
import Login from '../pages/Login';
import Game from  '../pages/Game';

export default class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/profile" component={Profile} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/game" component={Game} />
      </Switch>
    );
  }
}
