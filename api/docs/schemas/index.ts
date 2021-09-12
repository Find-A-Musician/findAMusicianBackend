import register from './register';
import login from './login';
import musicians from './musicians';
import instruments from './instruments';
import musician from './musician';
import genres from './genres';
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
  }};

export default handler;
