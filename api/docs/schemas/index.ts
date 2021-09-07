import postUser from './user/postUser';

const handler = {
  paths: {
    '/user/{other}/{test}': {
      ...postUser,
    },
  }};

export default handler;
