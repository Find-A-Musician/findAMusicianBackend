require('dotenv').config();
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import docs from '../docs/config/index';
import authenticateToken from '../auth/authenticateToken';


// router import
import registerRouter from '../routes/register';
import loginRouter from '../routes/login';
import logoutRouter from '../routes/logout';
import musiciansRouter from '../routes/musicians';
import instrumentRouter from '../routes/instruments';
import musicianRouter from '../routes/musician';
import genresRouter from '../routes/genres';
import refreshTokenRouter from '../routes/refreshToken';
import groupInviteRouter from '../routes/groupMusician';
import meRouter from '../routes/me';

const app = express();


app.use(cors());
app.use(express.json());

// auth routes
app.get('/test', authenticateToken, (req, res)=>{
  const userId = req.userId;
  res.status(200).json({
    userId,
  });
});
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/refresh_token', refreshTokenRouter);
app.use('/logout', authenticateToken, logoutRouter);

// musicians route
app.use('/me', authenticateToken, meRouter);
app.use('/musician', authenticateToken, musicianRouter);
app.use('/musicians', musiciansRouter);
app.use('/instruments', authenticateToken, instrumentRouter);
app.use('/genres', authenticateToken, genresRouter);
app.use('/group/invitation', authenticateToken, groupInviteRouter);

// serve the API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(docs));

export default app;
