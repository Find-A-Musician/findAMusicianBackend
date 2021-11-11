import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';

const tags: OpenAPIV3.Document['tags'] = [
  { name: 'genres', description: 'Everything related to the genre music' },
  { name: 'groups', description: 'Everything related to the music groups' },
  { name: 'auth', description: 'Everything related to the authentification' },
  { name: 'musician', description: 'Everything related to the musicians' },
  {
    name: 'profil',
    description: 'Everything related to the current logged user profil',
  },
  {
    name: 'test',
    description: 'Route for test',
  },
];
export default tags;
