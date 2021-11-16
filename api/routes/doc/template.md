# Docs for creating API Route endpoint

## Template for API route

### Classic async API route

```ts
import express from 'express';
import query from '../postgres';
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
