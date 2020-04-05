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
];
