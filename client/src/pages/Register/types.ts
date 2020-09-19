import { HasCaptcha, HasRouter } from '../../App/types';

export interface RegisterState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  usernameAvailable: boolean | null;
  emailAvailable: boolean | null;
  passwordErrors: string[];
  complete: boolean;
  failed: boolean;
}

export interface RegisterProps extends HasRouter, HasCaptcha {}
