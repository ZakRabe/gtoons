export const init = (io: any) => {
  io.on('connection', function(socket: any) {
    console.log('a user connected');
    socket.on('message', function(message: any) {
      console.log(message);
      socket.emit('message', "Here's a message back!");
    });
  });
};
