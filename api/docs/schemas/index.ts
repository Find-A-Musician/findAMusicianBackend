import postUser from './user/postUser';
import register from './register';
const handler = {
  paths: {
    '/user/{other}/{test}': {
      ...postUser,
    },
    '/register': {
      ...register,
    },
  }};

export default handler;
