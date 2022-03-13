import 'reflect-metadata';
import generateType from './api/command/generateType';
import server from './api/server/server';
import http from 'http';
import createConnection from './api/db/createConnection';

// import reset from './api/db/reset';

const PORT = process.env.PORT || 8000;
const httpApp = new http.Server(server);

httpApp.listen(PORT, async () => {
  if (process.env.NODE_ENV === 'development') {
    await generateType();
    console.log(
      '📕 Swager documention : http://localhost:' + PORT + '/api-docs',
    );
  }

  await createConnection();

  // await reset();

  console.log(' 🔌 Listening on port : http://localhost:' + PORT);
});
