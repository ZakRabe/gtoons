import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import { Request, Response } from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Routes } from "./routes";
import socket from './socket';

createConnection().then(async connection => {

  // create express app
  const app = express();
  app.use(helmet());
  app.use(bodyParser.json());
  const http = require("http").Server(app);
  const io = require("socket.io")(http);
  socket.init(io)

  // register express routes from defined application routes
  Routes.forEach(route => {
    (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
      const result = (new (route.controller as any))[route.action](req, res, next);
      if (result instanceof Promise) {
        result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);
      } else if (result !== null && result !== undefined) {
        res.json(result);
      }
    });
  });

  app.set("port", process.env.PORT || 5000);

  const server = http.listen(5000, function () {
    console.log("listening on *:5000");
  });

}).catch(error => console.log(error));