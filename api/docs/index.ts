import basicInfo from './basicInfo';
import servers from './servers';
import components from './components';
import tags from './tags';
import schema from './schemas/index';

const docs = {
  ...basicInfo,
  ...servers,
  ...components,
  ...tags,
  ...schema,
};

export default docs;
