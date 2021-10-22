import basicInfo from './basicInfo';
import servers from './servers';
import components from './components';
import tags from './tags';
import schemas from './schemas';
import { OpenAPIV3 } from 'openapi-types';

const docs: OpenAPIV3.Document = {
  ...basicInfo,
  ...servers,
  ...components,
  ...tags,
  paths: schemas,
};

export default docs;
