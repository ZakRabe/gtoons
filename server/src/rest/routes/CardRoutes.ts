import { CardController } from '../controller/CardController';

export const CardRoutes = [
  {
    method: 'get',
    route: '/cards/all',
    controller: CardController,
    action: 'all',
  },
];
