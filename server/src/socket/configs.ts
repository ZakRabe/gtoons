import MatchMakingConfigs from './controllers/MatchMaking/config';
import DeckBuilderConfigs from './controllers/DeckBuilder/config'

export const combinedSocketConfigs = [...MatchMakingConfigs,...DeckBuilderConfigs];

export default combinedSocketConfigs;
