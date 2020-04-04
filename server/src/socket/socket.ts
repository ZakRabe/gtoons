import { Socket } from 'socket.io';
import socketConfigs from './configs';

export const init = (io: any) => {
  io.on('connection', function(socket: Socket) {
    socket.on('message', function(message: any) {
      console.log(message);
      socket.emit('message', "Here's a message back!");
    });

    socketConfigs.forEach(config => {
      const { controller, event, action } = config;
      const ctrl = new controller(socket);

      socket.on(event, async () => {
        const response = await ctrl[action]();
      });
    });

    console.log('a user connected');
    // socket.on('findMatch', (data: { deckId: number }) => {
    //   // do some sort of db logic here to create a game,
    //   // add the user id, the deck they select
    //   // save a record to the db

    //   const GameModel = {};
    //   socket.emit('newMatch', GameModel);
    // });

    // const GameController = new GameSocketController();

    // socket.on('turn1', GameController.turn)

    // socket.on('turn1', (data: any) => {
    //   // do validation
    //   // look up the game for the player

    //   // check the card are in the user's collection
    //   // check the cards are in the deck
    //   // check the cards should be in the hand

    //   // save the turn data to the board state
    //   let p1Board, p2Board: any;
    //   if (p1Board.isValid() && p2Board.isValid()) {
    //     socket.emit('nextTurn', {});
    //   }
  });
};
