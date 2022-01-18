# Docs for creating API Route endpoint

## Template for API route

### Classic async API route

```ts
import express from 'express';
import pg from '../postgres';
import sql from 'sql-template-strings';
import type { operations } from '@schema';
import type {
  getHTTPCode,
  getResponsesBody,
  getRequestBody,
  getPathParams,
} from '@typing';
import type core from 'express-serve-static-core';

const router = express.Router();

type Foo = operations['Bar'];

router.get(
  '/',
  async (
    req: core.Request<
      {},
      getResponsesBody<Foo>,
      getRequestBody<Foo>,
      getPathParams<Foo>
    >,
    res: core.Response<getResponsesBody<Foo>, {}, getHTTPCode<Foo>>,
  ) => {},
);

export default router;
```

### Classic OpenApi schema

```ts
import { HandlerDefinition } from 'api/types/typing';

const schema: HandlerDefinition = {
  path: '/',
  post: {
    operationId: '',
    tags: [''],
    description: '',
    security: [{ BearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {},
        },
      },
    },
    responses: {
      500: {
        description: 'Error intern server',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/httpError',
            },
          },
        },
      },
    },
  },
};

export default schema;
```
