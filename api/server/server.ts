import dotenv from 'dotenv';
import express, { NextFunction } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import openApiDocs from '../docs/openApiDoc';
import authenticateToken from '../auth/authenticateToken';
import RateLimit from 'express-rate-limit';
import * as OpenApiValidator from 'express-openapi-validator';

// router import
import registerRouter from '../routes/register';
import loginRouter from '../routes/login';
import refreshTokenRouter from '../routes/refreshToken';
import logoutRouter from '../routes/logout';
import type {
  InternalServerError,
  UnsupportedMediaType,
  RequestEntityTooLarge,
  BadRequest,
  MethodNotAllowed,
  NotAcceptable,
  NotFound,
  Unauthorized,
  Forbidden,
} from 'express-openapi-validator/dist/framework/types';
import Logger from '../log/logger';

import type { Request, Response } from 'express';

import musiciansRouter from '../routes/musicians';
import instrumentRouter from '../routes/instruments';
import genresRouter from '../routes/genres';
import profilRouter from '../routes/profil';
import groupsRouter from '../routes/groups';
import eventsRoute from '../routes/events';
import infoRouter from '../routes/info';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// set up rate limiter: maximum of 30 requests per minute, 1 per 2s
if (process.env.NODE_ENV === 'production') {
  const limiter = RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30,
    handler: (_, res) => {
      res.status(429).json({ msg: 'E_TOO_MANY_REQUEST' });
    },
  });

  // apply rate limiter to all requests

  app.use(limiter);
}

// serve the API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocs));

app.use(
  OpenApiValidator.middleware({
    apiSpec: openApiDocs,
    validateRequests: true,
    validateResponses: true,
  }),
);

// auth routes
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/refresh_token', refreshTokenRouter);
app.use('/logout', authenticateToken, logoutRouter);

// musicians route
app.use('/profil', authenticateToken, profilRouter);
app.use('/musicians', musiciansRouter);

// instruments route
app.use('/instruments', instrumentRouter);

// genre route
app.use('/genres', genresRouter);

//group route
app.use('/groups', authenticateToken, groupsRouter);

// event route
app.use('/events', authenticateToken, eventsRoute);

// info route
app.use('/info', infoRouter);

type ErrorOpenApi =
  | InternalServerError
  | UnsupportedMediaType
  | RequestEntityTooLarge
  | BadRequest
  | MethodNotAllowed
  | NotAcceptable
  | NotFound
  | Unauthorized
  | Forbidden;

app.use(
  (
    err: Error | ErrorOpenApi,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (
      (err as ErrorOpenApi).message &&
      (err as ErrorOpenApi).errors &&
      (err as ErrorOpenApi).status
    ) {
      // The error is throw by OpenApiValidator
      Logger.info(err);

      res.status((err as ErrorOpenApi).status || 500).json({
        message: (err as ErrorOpenApi).message,
        stack: (err as ErrorOpenApi).errors,
      });
    } else {
      Logger.error(err);

      res
        .status(500)
        .json({ status: 500, message: 'E_UNKNOWN_ERROR', stack: err });
    }
    next();
  },
);

export default app;
