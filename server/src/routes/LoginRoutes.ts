import { LoginController } from '../controller/LoginController';
import { checkJwt } from '../middleware/checkJwt';

export const LoginRoutes = [
  {
    method: 'post',
    route: '/login/submit',
    controller: LoginController,
    action: 'submit'
  },
  {
    method: 'get',
    route: '/login/validateToken',
    middleware: [checkJwt],
    controller: LoginController,
    action: 'validateToken'
  }
];
