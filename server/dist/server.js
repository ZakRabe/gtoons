"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const http = require("http").Server(app_1.default);
// set up socket.io and bind it to our
// http server.
const io = require("socket.io")(http);
// whenever a user connects on port 5000 via
// a websocket, log that a user has connected
io.on("connection", function (socket) {
    console.log("a user connected");
    socket.on("message", function (message) {
        console.log(message);
        socket.emit("message", "Here's a message back!");
    });
});
const server = http.listen(5000, function () {
    console.log("listening on *:5000");
});
//# sourceMappingURL=server.js.map