import register from './register';
import login from './login';
const handler = {
  paths: {
    '/register': {
      ...register,
    },
    '/login': {
      ...login,
    },
  }};

export default handler;
