import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import { Request, Response } from 'express';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Routes } from './routes';
import socket from './socket';

// create express app
const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.set('port', process.env.PORT || 5000);
const http = require('http').Server(app);
const io = require('socket.io')(http);
socket.init(io);

const server = http.listen(5000, function() {
  console.log('listening on *:5000');
});

app.use(function(req, _res, next) {
  console.log(`${req.method} ${req.path}`);
  next();
});

const validResult = (result: any) => result !== null && result !== undefined;

createConnection()
  .then(async _connection => {
    // register express routes from defined application routes
    Routes.forEach(routeConfig => {
      const { method, route, action, controller } = routeConfig;
      (app as any)[method](
        route,
        (req: Request, res: Response, next: Function) => {
          const result = (new controller() as any)[action](req, res, next);
          if (result instanceof Promise) {
            result.then(output =>
              validResult(output) ? res.send(output) : undefined
            );
          } else if (validResult(result)) {
            res.json(result);
          }
        }
      );
    });
  })
  .catch(error => console.log(error));
