import { RegisterController } from '../controller/RegisterController';

export const RegisterRoutes = [
  {
    method: 'get',
    route: '/register/validUsername',
    controller: RegisterController,
    action: 'validUsername',
  },
  {
    method: 'get',
    route: '/register/validEmail',
    controller: RegisterController,
    action: 'validEmail',
  },
  {
    method: 'post',
    route: '/register/submit',
    controller: RegisterController,
    action: 'submit',
  },
];
