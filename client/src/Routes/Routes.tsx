import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import Game from '../pages/Game';
import Home from '../pages/Home';
import Lobby from '../pages/Lobby/Lobby';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import Register from '../pages/Register';

export default class Routes extends React.Component {
  render() {
    return (
      <main>
        <Container fluid>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/game" component={Game} />
            <Route path="/lobbies" component={Lobby} />
          </Switch>
        </Container>
      </main>
    );
  }
}
