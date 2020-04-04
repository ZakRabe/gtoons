import { HasRouter } from '../../App/type';

export interface RegisterState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  usernameAvailable: boolean | null;
  emailAvailable: boolean | null;
  passwordErrors: string[];
  complete: boolean;
}

export interface RegisterProps extends HasRouter {}
