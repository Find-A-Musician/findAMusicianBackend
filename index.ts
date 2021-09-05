import express from 'express';
import cors from 'cors';
import http from 'http';
import swaggerUi from 'swagger-ui-express';
import userRouter from './api/routes';
import docs from './api/docs/index';
const app = express();
const httpApp = new http.Server(app);
export const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res, next) => {
  res.status(200).send('yesy');
});

app.get('/test', userRouter);
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
httpApp.listen(PORT, () => {
  console.log(' 🔌 Listening on port : http://localhost:' + PORT);
  console.log('📕 Swager documention : http://localhost:'+PORT+'/api-docs');
});

