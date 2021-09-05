import {PORT} from '../../index';

const server = {
  servers: [
    {
      url: 'http://localhost:'+PORT,
      description: 'Local server',
    },
  ],
};


export default server;
