import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import Game from '../pages/Game';
import Home from '../pages/Home';
import Lobbies from '../pages/Lobbies';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import Register from '../pages/Register';
import DeckBuilder from '../pages/DeckBuilder';
import AuthRoute from '../components/AuthRoute';

export default class Routes extends React.Component {
  render() {
    return (
      <main>
        <Container fluid style={{ height: '100%' }}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />

            <AuthRoute path="/profile" component={Profile} />
            <AuthRoute path="/game" component={Game} />
            <AuthRoute path="/lobbies" component={Lobbies} />
            <AuthRoute path="/deckBuilder" component={DeckBuilder} />
          </Switch>
        </Container>
      </main>
    );
  }
}
