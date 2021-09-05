import getUser from './user/getUser';

const handler = {
  paths: {
    '/user': {
      ...getUser,
    },
  }};

export default handler;
