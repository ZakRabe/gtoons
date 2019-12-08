import app from "./app";
import socket from './socket'
import "reflect-metadata";

const http = require("http").Server(app);
// set up socket.io and bind it to our
// http server.
const io = require("socket.io")(http);

// whenever a user connects on port 5000 via
// a websocket, log that a user has connected
socket.init(io)

const server = http.listen(5000, function () {
  console.log("listening on *:5000");
});