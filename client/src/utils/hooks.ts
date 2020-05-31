import io from 'socket.io-client';
import React, { useEffect, useState } from 'react';

export const useSocketNamespace = (namespace: string) => {
  const [socket, setSocket] = React.useState<SocketIOClient.Socket>();
  useEffect(() => {
    setSocket(io(namespace));
  }, [namespace]);
  return socket as SocketIOClient.Socket;
};

export const useSocketOn = (
  socket: SocketIOClient.Socket,
  eventName: string,
  callback: (...args: any[]) => void | undefined,
  deps?: any[]
) => {
  useEffect(() => {
    console.log(socket);
    if (socket) {
      socket.on(eventName, callback);
    }
    return () => {
      console.log(socket);
      if (socket) {
        socket.off(eventName);
      }
    };
  }, [socket, ...(deps || [])]);
};
