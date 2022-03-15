import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import openApiDocs from '../docs/openApiDoc';
import authenticateToken from '../auth/authenticateToken';
import RateLimit from 'express-rate-limit';
import * as OpenApiValidator from 'express-openapi-validator';

// router import
import registerRouter from '../routes/auth/register';
import loginRouter from '../routes/auth/login';
import refreshTokenRouter from '../routes/auth/refreshToken';
import logoutRouter from '../routes/auth/logout';

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

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // format error
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

export default app;
