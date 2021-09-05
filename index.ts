import express from 'express';
import cors from 'cors';
import http from 'http';
import {initialize} from 'express-openapi';
import swaggerUi from 'swagger-ui-express';

const app = express();
const httpApp = new http.Server(app);
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res, next) => {
  res.status(200).send('yesy');
});

initialize({
  app,
  apiDoc: require('./api/api-doc'),
  paths: './api/controllers',
  routesGlob: '**/*.{ts,js}',
  routesIndexFileRegExp: /(?:index)?\.[tj]s$/,
});

app.use(
    '/documentation',
    swaggerUi.serve,
    swaggerUi.setup(null, {
      swaggerOptions: {
        url: `http://localhost:${PORT}/api-docs`,
      },
    }),
);

if (process.env.NODE_ENV === 'production') {
  // Static folder
  app.use(express.static(__dirname + '/public/'));

  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}
httpApp.listen(PORT, () => {
  console.log('Listening on port : http://localhost:' + PORT);
});

const test = 'test';
