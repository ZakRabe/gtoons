export interface LobbyProps {
  id: number;
  name: string;
  created: string;
  capacity: number;
  connectedCount: number;
  owner: any;
  game: any;
  lobbiesSocket: SocketIOClient.Socket;
}
