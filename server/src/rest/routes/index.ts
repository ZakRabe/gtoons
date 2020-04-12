import { UserRoutes } from './UserRoutes';
import { RegisterRoutes } from './RegisterRoutes';
import { LoginRoutes } from './LoginRoutes';
import { EngineRoutes } from './EngineRoutes';
import { DeckBuilderRoutes } from './DeckBuilderRoutes';
import { CardRoutes } from './CardRoutes';

export const Routes = [
  ...UserRoutes,
  ...RegisterRoutes,
  ...LoginRoutes,
  ...EngineRoutes,
  ...DeckBuilderRoutes,
  ...CardRoutes,
];
