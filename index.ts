import express from 'express';
import cors from 'cors';
import http from 'http';
import swaggerUi from 'swagger-ui-express';
import initializeTypes from './command/initializeTypes';
import userRouter from './api/routes/user';
import docs from './api/docs/index';

export const PORT = process.env.PORT || 8000;

const app = express();
const httpApp = new http.Server(app);

app.use(cors());
app.use(express.json());


app.use('/user', userRouter);

app.get('/docs', (req, res)=>{
  res.status(200).json(docs);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(docs));
console.log(PORT);
console.log(docs);
if (process.env.NODE_ENV === 'production') {
  // Static folder
  app.use(express.static(__dirname + '/public/'));

  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}


httpApp.listen(PORT, async () => {
  await initializeTypes();
  console.log(' 🔌 Listening on port : http://localhost:' + PORT);
  console.log('📕 Swager documention : http://localhost:'+PORT+'/api-docs');
});


