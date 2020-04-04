import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Request, Response } from 'express';
import * as helmet from 'helmet';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Routes } from './routes';
import socket from './socket';
import { checkJwt } from './middleware/checkJwt';

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

interface RouteConfig {
  method: string;
  route: string;
  action: string;
  controller: any;
  middleware?: any;
}

createConnection()
  .then(async _connection => {
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
              .then(output => {
                // if the result has a statusCode attribute,
                // we'll assume its a full response, and just return it
                if (validResult(output) && output.statusCode) {
                  return output;
                } else {
                  return validResult(output) ? res.send(output) : undefined;
                }
              })
              .catch(error => {
                console.log(error);
              });
          } else if (validResult(result)) {
            res.json(result);
          }
        }
      );
    });
  })
  .catch(error => console.log(error));
