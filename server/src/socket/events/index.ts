import DeckBuilderConfigs from './DeckBuilder';
import LobbiesConfigs from './Lobbies';
import GameConfigs from './Game';

export const globalEvents = [...DeckBuilderConfigs];

export const lobbiesEvents = [...LobbiesConfigs];
export const gamesEvents = [...GameConfigs];

export default {
  globalEvents,
  lobbiesEvents,
  gamesEvents,
};
