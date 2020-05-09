import { SandboxController } from '../controller/SandboxController';

export const SandboxRoutes = [
  {
    method: 'post',
    route: '/sandbox/calculateScore',
    controller: SandboxController,
    action: 'calculateScore',
  },
];
