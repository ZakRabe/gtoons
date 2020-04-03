import { UserController } from '../controller/UserController';
import { checkJwt } from '../middleware/checkJWT';
import { checkRoles } from '../middleware/checkRoles';

export const UserRoutes = [
  {
    method: 'get',
    route: '/users',
    middleware: [checkJwt, checkRoles(['ADMIN'])],
    controller: UserController,
    action: 'all'
  },
  {
    method: 'get',
    route: '/users/:id',
    middleware: [checkJwt, checkRoles(['ADMIN'])],
    controller: UserController,
    action: 'one'
  },
  {
    method: 'post',
    route: '/users',
    middleware: [checkJwt, checkRoles(['ADMIN'])],
    controller: UserController,
    action: 'save'
  },
  {
    method: 'delete',
    route: '/users/:id',
    middleware: [checkJwt, checkRoles(['ADMIN'])],
    controller: UserController,
    action: 'remove'
  }
];
