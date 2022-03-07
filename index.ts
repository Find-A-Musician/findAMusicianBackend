import 'reflect-metadata';
import express from 'express';
import generateType from './api/command/generateType';
import server from './api/server/server';
import http from 'http';
import createConnection from './api/db/createConnection';

const PORT = process.env.PORT || 8000;
const httpApp = new http.Server(server);

if (process.env.NODE_ENV === 'production') {
  // Static folder
  server.use(express.static(__dirname + '/public/'));

  // Handle SPA
  server.get(/.*/, (req, res) =>
    res.sendFile(__dirname + '/public/index.html'),
  );
}

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

    await createConnection();
    console.log('💾 Connection to DB successfull');
  }

  console.log(' 🔌 Listening on port : http://localhost:' + PORT);
});
