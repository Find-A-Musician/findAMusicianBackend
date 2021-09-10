# findAMusician

A website for my school where the musicians can contact each others, create groups and register to play at events

## Development

To run the API in development mode , run rhis command :

```bash
docker-compose up
```

Every changes you maketo the database restart the server and recreate types.

## Useful commands

### Reset the postgres database

```bash
command/pg_reset.sh
```

### lint the project

```bash
npm run lint
```

### get a random uuid

```bash
npm run uuid
```

## DB architecture

see the DB architecture there : https://app.diagrams.net/#G1qQYCvZrO-_BE1svWz_xGW_J_nBfvSYip

## Maquette

https://www.figma.com/file/HOpu5h8KqPTw0abgOWBM0i/Find-a-musicien?node-id=0%3A1

## documentation

- postgresql : https://glaucia86.medium.com/developing-a-crud-node-js-application-with-postgresql-d25febb1cc4

- pgsql : https://blog.logrocket.com/nodejs-expressjs-postgresql-crud-rest-api-example/

- openAPI : https://www.google.com/amp/s/www.freecodecamp.org/news/how-to-build-explicit-apis-with-openapi/amp/

- openAPI : https://github.com/mwangiKibui/node.js-rest-api-documentation

- auth express : https://youtu.be/mbsmsi7l3r4

- Eslint : https://dev.to/devdammak/setting-up-eslint-in-your-javascript-project-with-vs-code-2amf

- pgsql : https://jessitron.com/2020/05/25/develop-in-docker-node-js-express-postgresql-on-heroku/

dokcer-pgsql : https://codewithhugo.com/node-postgres-express-docker-compose/
