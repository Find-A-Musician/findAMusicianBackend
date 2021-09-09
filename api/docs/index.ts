import basicInfo from './basicInfo';
import servers from './servers';
import components from './components';
import tags from './tags';
import schema from './schemas/index';
import security from './security';

const docs = {
  ...basicInfo,
  ...servers,
  ...components,
  ...security,
  ...tags,
  ...schema,
};

export default docs;
