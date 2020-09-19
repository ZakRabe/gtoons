import { LoginController } from '../controller/LoginController';
import { checkCaptcha } from '../middleware/checkCaptcha';
import { checkJwt } from '../middleware/checkJwt';

export const LoginRoutes = [
  {
    method: 'post',
    route: '/login/submit',
    middleware: [checkCaptcha],
    controller: LoginController,
    action: 'submit',
  },
  {
    method: 'get',
    route: '/login/validateToken',
    middleware: [checkJwt],
    controller: LoginController,
    action: 'validateToken',
  },
];
