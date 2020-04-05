import { RouteComponentProps } from 'react-router-dom';

export interface HasSocket {
  socket: any;
}
export interface HasRouter extends RouteComponentProps {}
