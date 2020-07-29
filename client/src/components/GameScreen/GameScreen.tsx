import React, { useEffect, useState } from 'react';
import { GameScreenProps } from './types';
import { useSocketNamespace } from '../../utils/hooks';
import { isLoggedIn } from '../../utils/auth';
import { Loading } from 'carbon-components-react';
import Intro from './Intro/Intro';

/*
Starting animations: 
Spectators joining late shouldn't see this

Players name + Avatar
Colors + Count
Score
Deck card count display

*/

const GameScreen: React.FunctionComponent<GameScreenProps> = (props) => {
  const { game } = props;
  const socket = useSocketNamespace('/games');

  console.log(game);

  const [playersConnected, setPlayersConnected] = useState(false);
  const [introPlayed, setIntoPlayed] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIntoPlayed(true);
    }, 10000);
  }, [playersConnected]);

  useEffect(() => {
    if (socket) {
      // announce youself as connected to the gameScreen
      socket.emit('playerConnected', { token: isLoggedIn(), gameId: game.id });

      socket.on('allPlayersConnected', () => {
        setPlayersConnected(true);
      });
    }
  }, [socket]);

  const renderLoading = () => {
    return <Loading />;
  };

  const render = () => {
    if (!playersConnected) {
      return renderLoading();
    }
    if (!introPlayed) {
      return <Intro game={game} />;
    }

    return <div>GAME</div>;
  };

  return render();
};

export default GameScreen;
