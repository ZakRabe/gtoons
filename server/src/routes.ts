import { UserRoutes } from './routes/UserRoutes';
import { RegisterRoutes } from './routes/RegisterRoutes';
import { LoginRoutes } from './routes/LoginRoutes';
import { EngineRoutes} from './routes/EngineRoutes';
import { DeckBuilderRoutes } from './routes/DeckBuilderRoutes';
import { CardRoutes } from './routes/CardRoutes';

export const Routes = [
  ...UserRoutes, 
  ...RegisterRoutes, 
  ...LoginRoutes,
  ...EngineRoutes, 
  ...DeckBuilderRoutes,
  ...CardRoutes
];
