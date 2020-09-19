import { HasCaptcha, HasRouter } from '../../App/types';

export interface LoginProps extends HasRouter, HasCaptcha {}
export interface LoginState {
  username: string;
  password: string;
  error?: string;
}
