import { Socket } from 'socket.io';
import socketConfigs from './events';

const initNamespace = (socket, namespaceSocket, events) => {
  events.forEach(config => {
    const { controller, event, action } = config;
    const ctrl = new controller(socket, namespaceSocket);

    socket.on(event, async (...params) => {
      const response = await ctrl[action](...params);
    });
  });
};

export const init = (io, lobbies, games) => {
  const { globalEvents, lobbiesEvents, gamesEvents } = socketConfigs;

  io.on('connection', function(socket: Socket) {
    console.log('a user connected');
    initNamespace(socket, io, globalEvents);
  });

  lobbies.on('connection', function(socket: Socket) {
    console.log('user connected to the lobbies namespace');
    initNamespace(socket, lobbies, lobbiesEvents);
  });

  games.on('connection', function(socket: Socket) {
    console.log('user connected to the games namespace');
    initNamespace(socket, games, gamesEvents);
  });
};
