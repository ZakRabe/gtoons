# Deployment README

Hopefully this should help me if I forget the proper steps for deployment.

1. build the server and client
   `npm install && npm run build`

2. zip up the client build contents

3. zip up the server build contents

4. copy the orm config from `deploy/prod/server`

5. copy the node_modules from server into the zip
