import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';

const server: OpenAPIV3.Document['servers'] = [
  {
    url: `http://localhost:8000`,
    description: 'Local server',
  },
];

export default server;
