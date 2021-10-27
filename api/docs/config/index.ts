import info from './basicInfo';
import servers from './servers';
import components from './components';
import tags from './tags';
import security from './security';
import paths from './paths';
import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';

const docs: OpenAPIV3.Document = {
  openapi: '3.0.1',
  info,
  servers,
  security,
  components,
  tags,
  paths,
};

export default docs;
