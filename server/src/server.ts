import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import { Request, Response } from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Routes } from "./routes";
import socket from "./socket";

// create express app
const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.set("port", process.env.PORT || 5000);
const http = require("http").Server(app);
const io = require("socket.io")(http);
socket.init(io);

const server = http.listen(5000, function() {
  console.log("listening on *:5000");
});

app.use(function(req, res, next) {
  console.log(req.method);
  console.log(req.path);
  next();
});

createConnection()
  .then(async connection => {
    // register express routes from defined application routes
    Routes.forEach(route => {
      (app as any)[route.method](
        route.route,
        (req: Request, res: Response, next: Function) => {
          const result = new (route.controller as any)()[route.action](
            req,
            res,
            next
          );
          if (result instanceof Promise) {
            result.then(result =>
              result !== null && result !== undefined
                ? res.send(result)
                : undefined
            );
          } else if (result !== null && result !== undefined) {
            res.json(result);
          }
        }
      );
    });
  })
  .catch(error => console.log(error));
