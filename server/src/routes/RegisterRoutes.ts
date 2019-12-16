import { RegisterController } from '../controller/RegisterController';

export const RegisterRoutes = [
  {
    method: 'get',
    route: '/register/username',
    controller: RegisterController,
    action: 'username'
  }
];
