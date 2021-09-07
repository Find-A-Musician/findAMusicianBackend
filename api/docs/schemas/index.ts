import postUser from './user/postUser';

const handler = {
  paths: {
    '/user': {
      ...postUser,
    },
  }};

export default handler;
