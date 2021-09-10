require('dotenv').config();
import express from 'express';
import cors from 'cors';
import http from 'http';
import swaggerUi from 'swagger-ui-express';
import initializeTypes from './command/initializeTypes';
import docs from './api/docs/index';
import authenticateToken from './api/auth/authenticateToken';

// router import
import registerRouter from './api/routes/register';
import loginRouter from './api/routes/login';
import musiciansRouter from './api/routes/musicians';
import instrumentRouter from './api/routes/instruments';
export const PORT = process.env.PORT || 8000;

const app = express();
const httpApp = new http.Server(app);


app.use(cors());
app.use(express.json());

// auth routes
app.use('/register', registerRouter);
app.use('/login', loginRouter);

// musicians route
app.use('/musicians', authenticateToken, musiciansRouter);
app.use('/instruments', authenticateToken, instrumentRouter);

// serve the API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(docs));


if (process.env.NODE_ENV === 'production') {
  // Static folder
  app.use(express.static(__dirname + '/public/'));

  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}


httpApp.listen(PORT, async () => {
  if (process.env.NODE_ENV==='development') {
    await initializeTypes();
    console.log('📕 Swager documention : http://localhost:'+PORT+'/api-docs');
  } {
    console.log(' 🔌 Listening on port : http://localhost:' + PORT);
  }
});


