import 'reflect-metadata';
import generateType from './api/command/generateType';
import server from './api/server/server';
import http from 'http';
import createConnection from './api/db/createConnection';

const PORT = process.env.PORT || 8000;
const httpApp = new http.Server(server);

httpApp.listen(PORT, async () => {
  if (process.env.NODE_ENV === 'development') {
    try {
      await generateType();
      console.log(
        '📕 Swager documention : http://localhost:' + PORT + '/api-docs',
      );
    } catch (err) {
      console.log(err);
      throw new Error('E_TYPES_FAILED');
    }
  }

  await createConnection();

  console.log(' 🔌 Listening on port : http://localhost:' + PORT);
});
