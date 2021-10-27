import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';

const tags: OpenAPIV3.Document['tags'] = [
  {
    name: 'test tags',
  },
];
export default tags;
