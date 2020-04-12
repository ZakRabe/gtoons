import DeckBuilderConfigs from './DeckBuilder';
import LobbiesConfigs from './Lobbies';

export const globalEvents = [...DeckBuilderConfigs];

export const lobbiesEvents = [...LobbiesConfigs];
export const gamesEvents = [];

export default {
  globalEvents,
  lobbiesEvents,
  gamesEvents,
};
