import { UserRoutes } from './routes/UserRoutes';
import { RegisterRoutes } from './routes/RegisterRoutes';
import { LoginRoutes } from './routes/LoginRoutes';
import { EngineRoutes} from './routes/EngineRoutes';

export const Routes = [...UserRoutes, ...RegisterRoutes, ...LoginRoutes,...EngineRoutes];
