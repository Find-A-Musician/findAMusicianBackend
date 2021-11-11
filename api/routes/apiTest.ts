import express from 'express';
import type { operations } from '@schema';
import type {
  getHTTPCode,
  getResponsesBody,
  getRequestBody,
  getPathParams,
} from '@typing';
import type core from 'express-serve-static-core';

const router = express.Router();

type Test = operations['test'];

router.get(
  '/',
  async (
    req: core.Request<
      {},
      getResponsesBody<Test>,
      getRequestBody<Test>,
      getPathParams<Test>
    >,
    res: core.Response<getResponsesBody<Test>, {}, getHTTPCode<Test>>,
  ) => {
    const userId = req.userId;
    res.status(200).json({
      userId,
    });
  },
);

export default router;
