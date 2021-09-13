import register from './schemas/register';
import login from './schemas/login';
import musicians from './schemas/musicians';
import instruments from './schemas/instruments';
import musician from './schemas/musician';
import genres from './schemas/genres';
import refreshToken from './schemas/refreshToken';
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
    '/musician/{musicianId}': {
      ...musician,
    },
    '/instruments': {
      ...instruments,
    },
    '/genres': {
      ...genres,
    },
    '/refresh_token': {
      ...refreshToken,
    },
  }};

export default handler;
