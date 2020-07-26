import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import AuthRoute from '../components/AuthRoute';
import DeckBuilder from '../pages/DeckBuilder';
import DeckList from '../pages/DeckList';
import Game from '../pages/Game';
import Home from '../pages/Home';
import Lobbies from '../pages/Lobbies';
import Lobby from '../pages/Lobby';
import Login from '../pages/Login';
import PasswordReset from '../pages/PasswordReset';
import Profile from '../pages/Profile';
import Register from '../pages/Register';
import Sandbox from '../pages/Sandbox';
import { RoutesProps } from './types';

export default class Routes extends React.Component<RoutesProps> {
  render() {
    return (
      <main>
        <Container fluid style={{ height: '100%' }}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/passwordReset/:token?" component={PasswordReset} />
            <AuthRoute path="/profile" component={Profile} />
            <AuthRoute path="/game" component={Game} />
            <AuthRoute exact path="/lobbies/:lobbyId" component={Lobby} />
            <AuthRoute path="/lobbies" component={Lobbies} />
            <AuthRoute path="/deckBuilder/:deckId?" component={DeckBuilder} />
            <AuthRoute path="/deckList" component={DeckList} />
            <AuthRoute path="/sandbox" component={Sandbox} />
          </Switch>
        </Container>
      </main>
    );
  }
}
