import 'reflect-metadata';
import server from './api/server/server';
import http from 'http';
import createConnection from './api/db/createConnection';
import Logger from './api/log/logger';

const PORT = process.env.PORT || 8000;
const httpApp = new http.Server(server);

httpApp.listen(PORT, async () => {
  await createConnection();

  Logger.info('📕 Swager documention : http://localhost:' + PORT + '/api-docs');
  Logger.info(' 🔌 Listening on port : http://localhost:' + PORT);
});
