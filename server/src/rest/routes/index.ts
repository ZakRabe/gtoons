import { UserRoutes } from './UserRoutes';
import { RegisterRoutes } from './RegisterRoutes';
import { LoginRoutes } from './LoginRoutes';
import { EngineRoutes } from './EngineRoutes';
import { DeckBuilderRoutes } from './DeckBuilderRoutes';
import { CardRoutes } from './CardRoutes';
import { SandboxRoutes } from './SandboxRoutes';

export const Routes = [
  ...UserRoutes,
  ...RegisterRoutes,
  ...LoginRoutes,
  ...EngineRoutes,
  ...DeckBuilderRoutes,
  ...CardRoutes,
  ...SandboxRoutes,
];
