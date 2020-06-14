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

### System Requirements:

| Resource | Minimum | Recommended              |
| -------- | ------- | ------------------------ |
| OS       | -       | Win10, OSX, Ubuntu 18.04 |
| CPU      | 1 core  | 2 cores                  |
| Memory   | 1GB     | 2GB                      |

### Software Prerequisites:

NPM 13.3.0  
Optionally use NVM to manage node versions:

- [Windows](https://github.com/coreybutler/nvm-windows/releases)
- [OSX](https://github.com/nvm-sh/nvm)
- Ubuntu 18.04  
  `curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -`  
  `npm install -g n`  
  `n 13.3.0`  
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

#### NOTE: Added 6-13-2020

If you have an existing database from before the date above, you need to drop all the tables. The migrations to update column names weren't working, so instead we updated the migrations. We needed to rename a lot of foriegn key columns to avoid bugs in TypeORM

To-Do:  
Make migrations for database creation and user?

---

### Deploy Application:

The reToons engine is made up of two components, an Express server for the backend and a React app for the frontend.

Clone the Git repository:  
`git clone https://github.com/ZakRabe/gtoons.git`

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
`npm run start&`

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
