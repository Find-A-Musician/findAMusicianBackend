import register from './register';
import login from './login';
import musicians from './musicians';
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
  }};

export default handler;
