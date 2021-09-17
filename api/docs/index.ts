import basicInfo from './basicInfo';
import servers from './servers';
import components from './components';
import tags from './tags';
import schemas from './schemas';
const docs = {
  ...basicInfo,
  ...servers,
  ...components,
  ...tags,
  schemas,
};

export default docs;
