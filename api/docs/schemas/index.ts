import postUser from './user/postUser';
import register from './register';
import login from './login';
const handler = {
  paths: {
    '/user/{other}/{test}': {
      ...postUser,
    },
    '/register': {
      ...register,
    },
    '/login': {
      ...login,
    },
  }};

export default handler;
