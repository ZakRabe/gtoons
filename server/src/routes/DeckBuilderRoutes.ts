import { checkJwt } from '../middleware/checkJwt';
import { DeckBuilderController } from '../controller/DeckBuilderController';


export const DeckBuilderRoutes = [
  {
    method: 'get',
    route: '/deckBuilder/myCollection',
    middleware: [checkJwt],
    controller: DeckBuilderController,
    action: 'myCollection'
  },

  {
    method: 'post',
    route: '/deckBuilder/saveDeck',
    middleware: [checkJwt],
    controller: DeckBuilderController,
    action: 'saveDeck'
  },
];
