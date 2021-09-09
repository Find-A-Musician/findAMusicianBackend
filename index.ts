import express from 'express';
import cors from 'cors';
import http from 'http';
import swaggerUi from 'swagger-ui-express';
import initializeTypes from './command/initializeTypes';
import userRouter from './api/routes/user';
import docs from './api/docs/index';
import {Pool} from 'pg';

export const PORT = process.env.PORT || 8000;

const app = express();
const httpApp = new http.Server(app);

const pg = new Pool({
  user: 'user',
  host: 'postgres',
  database: 'db',
  password: 'pass',
  port: 5432,
});
pg.connect(function(err, client) {
  if (err) {
    console.log(err);
  };
  console.log('connected to the db');
});


app.use(cors());
app.use(express.json());


app.use('/user', userRouter);

app.get('/docs', (req, res)=>{
  res.status(200).json(docs);
});

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


