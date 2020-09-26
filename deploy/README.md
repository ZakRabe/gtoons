# Deployment README

TODO: Automate this more using tooling PROBLEMS: Powershell sucks

Hopefully this should help me if I forget the proper steps for deployment.

1. build the server and client

   linix:
   `npm install && npm run build`

   powershell:
   `npm install; npm run build`

2. copy the orm config from `deploy/prod/server`

   powershell:
   `Copy-Item ".\deploy\prod\server\ormconfig.json" -Destination ".\server\build"`

   **put real values in the fields!**
   TODO: Replace these with the [environment variables solution](https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md#using-environment-variables)

   if you need to change the db user pw: `ALTER USER gtoons@localhost IDENTIFIED BY 'aRealSecurePassword';`

3. copy the environment variables files to the build output
   **put real values in the environment variables!**

   `Copy-Item ".\deploy\prod\server\.env" -Destination ".\server\build"`

4. copy the `node_modules` from `server/` to the build folder. may take a while

   powershell:
   `Copy-Item ".\server\node_modules" -Recurse -Destination ".\server\build\node_modules"`

   TODO: Bundle this using [webpack](https://corpglory.com/s/express-webpack/)

5. zip up the client/server build output to `client.zip` & `server.zip`

6. upload the builds to the server

   `scp client/build/client.zip root@167.172.128.180:/var/www/`

   `scp server/build/server.zip root@167.172.128.180:/var/www/`

7. check status of running apps

   `supervisorctl status`

8. stop the running apps

   `supervisorctl stop retoons_client; supervisorctl stop retoons_server`

9. delete the old stuff

   `rm -rf /var/www/html; rm -rf /var/www/server`

10. unzip the contents

    `unzip client.zip -d ./html/ && unzip server.zip -d ./server/`

11. Ensure ts-node and typescript are installed

    `npm install -g ts-node; npm install -g typescript`

12. run server migrations

    `ts-node ./server/node_modules/typeorm/cli.js migration:run`

13. start the apps

    `supervisorctl start retoons_client; supervisorctl start retoons_server`

14. check the status of restarted apps

    `supervisorctl status`

15. Possibly check logs in if somethings not working

    `var/logs/supervisor`
