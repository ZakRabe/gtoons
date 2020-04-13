import io from 'socket.io-client';
import React, { useEffect } from 'react';

export const useSocketNamespace = (namespace: string) => {
  const [socket, setSocket] = React.useState<SocketIOClient.Socket>();
  useEffect(() => {
    setSocket(io(namespace));
  }, [namespace]);
  return socket as SocketIOClient.Socket;
};
