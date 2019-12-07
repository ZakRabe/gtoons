import app from "./app";

const http = require("http").Server(app);
// set up socket.io and bind it to our
// http server.
const io = require("socket.io")(http);

// whenever a user connects on port 5000 via
// a websocket, log that a user has connected
io.on("connection", function (socket: any) {
  console.log("a user connected");
  socket.on("message", function (message: any) {
    console.log(message);
    socket.emit("message", "Here's a message back!")
  });
});

const server = http.listen(5000, function () {
  console.log("listening on *:5000");
});