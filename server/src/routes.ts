import { UserRoutes } from './routes/UserRoutes';
import { RegisterRoutes } from './routes/RegisterRoutes';
import { LoginRoutes } from './routes/LoginRoutes';

export const Routes = [...UserRoutes, ...RegisterRoutes, ...LoginRoutes];
