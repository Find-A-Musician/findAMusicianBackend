require('dotenv').config();
import express from 'express';
import initializeTypes from './command/initializeTypes';
import server from './api/server/server';
import http from 'http';

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
      await initializeTypes();
      console.log(
          '📕 Swager documention : http://localhost:' + PORT + '/api-docs',
      );
    } catch (err) {
      throw new Error('E_TYPEs_FAILED');
    }
  }
  {
    console.log(' 🔌 Listening on port : http://localhost:' + PORT);
  }
});

