require('dotenv').config({ path: __dirname + '/.env' });
import bodyParser from 'body-parser';
import express from 'express';
import { Request, Response } from 'express';
import helmet from 'helmet';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Routes } from './rest/routes';
import socket from './socket';
import { RouteConfig } from './types';

console.log('environment vars');
console.log('recaptcha');
console.log(process.env.RECAPTCHA_SECRET);
console.log('jwt');
console.log(process.env.JWT_SECRET);
console.log('env');
console.log(process.env.NODE_ENV);

const app = express();
app.use(helmet());

app.use(bodyParser.json());
app.set('port', process.env.PORT || 5000);
const http = require('http').Server(app);

const io = require('socket.io')(http);

const lobbies = io.of('/lobbies');
const games = io.of('/games');

const server = http.listen(5000, function () {
  console.log('listening on *:5000');
});

app.use(function (req, _res, next) {
  console.log(`${req.method} ${req.path}`);
  next();
});

const validResult = (result: any) => result !== null && result !== undefined;

createConnection()
  .then(async (_connection) => {
    // initialize socket events across the namespaces
    socket.init(io, lobbies, games);

    // register express routes from defined application routes
    Routes.forEach((routeConfig: RouteConfig) => {
      const { method, route, action, controller, middleware } = routeConfig;
      (app as any)[method](
        route,
        middleware ? [...middleware] : [],
        (req: Request, res: Response, next: Function) => {
          const result = (new controller() as any)[action](req, res, next);
          if (result instanceof Promise) {
            result
              .then((output) => {
                // if the result has a statusCode attribute,
                // we'll assume its a full response, and just return it
                if (validResult(output) && output.statusCode) {
                  return output;
                } else {
                  return validResult(output) ? res.send(output) : undefined;
                }
              })
              .catch((error) => {
                console.log(error);
              });
          } else if (validResult(result)) {
            res.json(result);
          }
        }
      );
    });
  })
  .catch((error) => console.log(error));
