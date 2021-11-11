import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import docs from '../docs/config/index';
import authenticateToken from '../auth/authenticateToken';
import * as OpenApiValidator from 'express-openapi-validator';
import type { Request, Response, NextFunction } from 'express';
// router import
import registerRouter from '../routes/register';
import loginRouter from '../routes/login';
import logoutRouter from '../routes/logout';
import musiciansRouter from '../routes/musicians';
import instrumentRouter from '../routes/instruments';
import genresRouter from '../routes/genres';
import refreshTokenRouter from '../routes/refreshToken';
import profilRouter from '../routes/profil';
import groupsRouter from '../routes/groups';
import testRouter from '../routes/apiTest';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

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

//instruments route
app.use('/instruments', authenticateToken, instrumentRouter);

//genre route
app.use('/genres', authenticateToken, genresRouter);

//group route
app.use('/groups', authenticateToken, groupsRouter);

// eslint-disable-next-line no-use-before-define
app.use((err, req, res, next) => {
  // format error
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

export default app;
