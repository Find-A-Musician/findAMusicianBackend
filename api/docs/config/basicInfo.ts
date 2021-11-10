import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';

const info: OpenAPIV3.Document['info'] = {
  version: '1.0.0',
  title: 'findAMusician',
  description: 'The API for the website findAMusician',
  contact: {
    name: 'Romain Guarinoni',
    email: 'romain.guar01@gmail.com',
    url: 'https://github.com/RomainGuarinoni',
  },
};

export default info;
