Needed:
NPM - 13.3.0
Optionally use NVM to manage node versions:

NVM windows:
https://github.com/coreybutler/nvm-windows/releases
NVM OSX:
https://github.com/nvm-sh/nvm

MySQL: 5.7.28
windows: https://dev.mysql.com/downloads/installer/
MySQL Server 5.7
MySQL Workbench 8.0

OSX: brew install mysql

Create databse called `gtoons`
`CREATE DATABASE gtoons;`
create user `gtoons` with password `test` and give it all privs on the gtoons db
`CREATE USER 'gtoons'@'localhost' IDENTIFIED BY 'test';`

```
GRANT ALL PRIVILEGES ON `gtoons` . * TO 'gtoons'@'localhost';
```

TODO: Make migrations for database creation and user?

Server - Express
Frontend - React

install typescript globally
`npm install -g typescript`

install ts-node globally
`npm install -g ts-node`

Running Migrations
`ts-node ./node_modules/typeorm/cli.js migration:run`

Running the App Locally:

The app has two parts, an express server for the backend, and a react app for the frontend

Running the React Frontend:
`cd client`
`npm run start`

hot-reloading is automatic, so any changes you make to the client source should automatically restart the front end and reload

Running the Express Backend:
`cd server`
`npm run start`

If you are working on the backend code, you can run:
`npm run watch`

this will automatically restart the backend server any time a source file changes
