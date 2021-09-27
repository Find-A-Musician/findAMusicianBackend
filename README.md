# findAMusician

A website for my school where the musicians can contact each others, create
groups and register to play at events

## Development

To run the API in development mode , run this command :

```bash
docker-compose up
```

You need to have installed Docker and docker-compose on your local machine.

Every changes you make to the database restart the server and recreate the
OpenAPI types.

## Create a new API endpoint

### Create an OpenAPI definition

Every endPoint has its own API definition based on the OpenAPI sandart.

First, create a file in the folder `/api/docs/schemas` and create your schema
like this :

```ts
///api/docs/schemas/example.ts
import { HandlerDefinition } from 'api/types/typing';

const schema: HandlerDefinition = {
  path: '/example', // the path of your endPoint relative to the Base URL of the application
  get: {
    operationId: 'exampleSchema', // a name which represent this operation
    //...a basic OpenAPI schema
  },
};

export default schema;
```

When the schema is done, it will be auto inserted in the swagger definition and
the types corresponding to the schema will be auto generated too.

### Create an express route

Create a file in the folder `/api/routes` and create your route like this :

```ts
///api/routes/example.ts
import express, { Request } from 'express';
import core from 'express-serve-static-core';
import type { operations } from '@schema';

//these methods extract the content of an OpenAPI operations type.
import { getHTTPCode, getResponsesBody } from '@typing';

const router = express.Router();

// the key of the operations object is the operationId you gave in the OpenAPI definition
type exampleOperation = operations['exampleSchema'];

const router = express.Router();

router.get(
  '/',
  async (
    req: Request,
    res: core.Response<
      getResponsesBody<exampleOperation>,
      {},
      getHTTPCode<exampleOperation>
    >,
  ) => {
    // ...your code
  },
);

export default router;
```

### Add your route to the server

Finnaly, you need to import your new router in the `server/server.ts` file like
this :

```ts
//server/server.ts

import testRouter from '../routes/example';

app.use('/example', testRouter);
```

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

see the DB architecture there :
https://app.diagrams.net/#G1qQYCvZrO-_BE1svWz_xGW_J_nBfvSYip

## Maquette

https://www.figma.com/file/HOpu5h8KqPTw0abgOWBM0i/Find-a-musicien?node-id=0%3A1

## documentation

- postgresql :
  https://glaucia86.medium.com/developing-a-crud-node-js-application-with-postgresql-d25febb1cc4

- pgsql :
  https://blog.logrocket.com/nodejs-expressjs-postgresql-crud-rest-api-example/

- openAPI :
  https://www.google.com/amp/s/www.freecodecamp.org/news/how-to-build-explicit-apis-with-openapi/amp/

- openAPI : https://github.com/mwangiKibui/node.js-rest-api-documentation

- auth express : https://youtu.be/mbsmsi7l3r4

- Eslint :
  https://dev.to/devdammak/setting-up-eslint-in-your-javascript-project-with-vs-code-2amf

- pgsql :
  https://jessitron.com/2020/05/25/develop-in-docker-node-js-express-postgresql-on-heroku/

dokcer-pgsql : https://codewithhugo.com/node-postgres-express-docker-compose/
