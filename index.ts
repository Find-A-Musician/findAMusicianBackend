import 'reflect-metadata';
import server from './api/server/server';
import http from 'http';
import createConnection from './api/db/createConnection';

import reset from './api/db/reset';

const PORT = process.env.PORT || 8000;
const httpApp = new http.Server(server);

httpApp.listen(PORT, async () => {
  await createConnection();

  // await reset();
  console.log('📕 Swager documention : http://localhost:' + PORT + '/api-docs');
  console.log(' 🔌 Listening on port : http://localhost:' + PORT);
});
