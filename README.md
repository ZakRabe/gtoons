# reToons (gToons Emulation Engine)

Welcome to the reToons project!  
The project is currently preparing for an Alpha release. More information will be available soon.

Did you know that we are on [Discord](https://discord.com/invite/W9Z9hSG)? Come join the community!

---

### Contributors

- [me](https://github.com/ZakRabe)
- [WLSN](https://github.com/WLSNprograms)
- [Omni](https://github.com/omnims)
- [i_d_k](https://github.com/AnujAsher)
- [shafferchance](https://github.com/shafferchance)

### System Requirements:

| Resource | Minimum | Recommended              |
| -------- | ------- | ------------------------ |
| OS       | -       | Win10, OSX, Ubuntu 18.04 |
| CPU      | 1 core  | 2 cores                  |
| Memory   | 1GB     | 2GB                      |

### Software Prerequisites:

NPM 14.4.0
Optionally use NVM to manage node versions:

- [Windows](https://github.com/coreybutler/nvm-windows/releases)
- [OSX](https://github.com/nvm-sh/nvm)
- Ubuntu 18.04  
  `curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -`  
  `npm install -g n`  
  `n 14.4.0`  
  `# Reload the shell to use the proper Node.js version.`

Global NPM Packages:

- `npm install -g typescript`
- `npm install -g ts-node`

MySQL 5.7.28

- [Windows](https://dev.mysql.com/downloads/installer/)  
  MySQL Server 5.7  
  MySQL Workbench 8.0

- OSX:  
  `brew install mysql`

- Ubuntu 18.04  
  `sudo apt install mysql-server`

---

### Database Setup:

Use a MySQL client to execute the database setup queries.

The following commands will result in the creation of a database called `gtoons`.  
There will be a user `gtoons` with the password `test`, which will have all privileges to the `gtoons` database.

```
CREATE DATABASE gtoons;
CREATE USER 'gtoons'@'localhost' IDENTIFIED BY 'test';
GRANT ALL PRIVILEGES ON `gtoons` . * TO 'gtoons'@'localhost';
FLUSH PRIVILEGES;
```

#### NOTE: Added 19/26/2020

If you have a database from before 19/9/2020. You need to drop all your tables and run migrations from an empty database.

---

### Deploy Application:

The reToons engine is made up of two components, an Express server for the backend and a React app for the frontend.

Clone the Git repository:  
`git clone https://github.com/ZakRabe/gtoons.git`

Copy the example environment variables from `deploy/dev/`into `server/src` and `client/src`

linux:
`cp ./deploy/prod/server/.env ./server/src; cp ./deploy/prod/client/.env ./client/src`

powershell:
`Copy-Item ".\deploy\prod\server\.env" -Destination ".\server\src"; Copy-Item ".\deploy\prod\client\.env" -Destination ".\client\src"`

Install the backend:  
`cd gtoons/server/`  
`npm install`

Run the database migrations:  
`cd gtoons/server/`  
`ts-node ./node_modules/typeorm/cli.js migration:run`

Install the frontend:  
`cd gtoons/client/`  
`npm install`

---

### Start the Express Backend:

`cd gtoons/server/`  
`npm run start`

If you are working on the backend code, you can run:  
`npm run watch`  
This will automatically restart the backend server when a source file changes.

### Start the React Frontend:

`cd gtoons/client/`  
`npm run start&`

Hot-reloading is automatic.  
Any changes you make to the client source should automatically reload the frontend.

---

### Troubleshooting:

ENOSPC: System limit for number of file watchers reached

Solution:

```
sysctl fs.inotify.max_user_watches=524288
fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sysctl -p
```

If you experience issues, please log an [Issue](https://github.com/ZakRabe/gtoons/issues) or ask for help in the [Discord](https://discord.com/invite/W9Z9hSG) chat server.

### Updating the database using migrations

[TypeORM Docs](https://typeorm.io/)

We use TypeORM to interact with the database. all data changes should be made in an entity file found in `server\src\common\entity`

Once you've made a change in the entities, run the command to create a migration for the change. Please describe the change you're making in the name.
`npm run migrate:gen -- -n=NameOfMyMigration`

If successful, you should see a message that the migration has been generated successfully, and there should be a new file in `server\src\common\migration`

To execute the changes from the migration to the database, run the migrate command
`npm run migrate`

If you need to write your own SQL for a migration (NOT RECCOMENDED), use the new command
`npm run typeorm migration:create -- -n=NameOfMyCustomMigration`
