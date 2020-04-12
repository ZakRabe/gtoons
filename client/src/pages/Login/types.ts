import { HasRouter } from '../../App/types';

export interface LoginProps extends HasRouter {}
export interface LoginState {
  username: string;
  password: string;
  error?: string;
}
