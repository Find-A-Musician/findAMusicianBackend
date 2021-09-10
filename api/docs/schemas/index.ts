import register from './register';
import login from './login';
import musicians from './musicians';
import instruments from './instruments';
const handler = {
  paths: {
    '/register': {
      ...register,
    },
    '/login': {
      ...login,
    },
    '/musicians': {
      ...musicians,
    },
    '/instruments': {
      ...instruments,
    },
  }};

export default handler;
