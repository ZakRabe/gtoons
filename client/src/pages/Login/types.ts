import { RouteComponentProps } from 'react-router-dom';

export interface LoginProps extends RouteComponentProps {}
export interface LoginState {
  username: string;
  password: string;
  error?: string;
}
