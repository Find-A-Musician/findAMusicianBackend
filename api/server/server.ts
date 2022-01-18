import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import docs from '../docs/config/index';
import authenticateToken from '../auth/authenticateToken';
import * as OpenApiValidator from 'express-openapi-validator';
// router import
import registerRouter from '../routes/auth/register';
import loginRouter from '../routes/auth/login';
import logoutRouter from '../routes/auth/logout';
import musiciansRouter from '../routes/musicians/musicians';
import instrumentRouter from '../routes/instruments/instruments';
import genresRouter from '../routes/genres/genres';
import refreshTokenRouter from '../routes/auth/refreshToken';
import profilRouter from '../routes//profil/profil';
import groupsRouter from '../routes/groups/groups';
import eventsRoute from '../routes/events/events';
import testRouter from '../routes/test/apiTest';
import infoRouter from '../routes/info/info';
import RateLimit from 'express-rate-limit';

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(docs));

app.use(
  OpenApiValidator.middleware({
    apiSpec: docs,
    validateRequests: true,
    validateResponses: true,
  }),
);

// test route
app.use('/test', authenticateToken, testRouter);

// auth routes
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/refresh_token', refreshTokenRouter);
app.use('/logout', authenticateToken, logoutRouter);

// musicians route
app.use('/profil', authenticateToken, profilRouter);
app.use('/musicians', musiciansRouter);

// instruments route
app.use('/instruments', authenticateToken, instrumentRouter);

// genre route
app.use('/genres', authenticateToken, genresRouter);

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
