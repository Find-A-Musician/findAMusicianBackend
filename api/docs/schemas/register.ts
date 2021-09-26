import { HandlerDefinition } from 'api/types/typing';

const schema: HandlerDefinition = {
  path: '/register',

  post: {
    operationId: 'register',
    tags: ['auth'],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['musician', 'password', 'genres', 'instruments'],
            properties: {
              musician: {
                $ref: '#/components/schemas/musician',
              },
              password: { type: 'string' },
              genres: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/genre',
                },
              },
              instruments: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/instrument',
                },
              },
            },
          },
          example: {
            musician: {
              id: 'uuid',
              email: 'john.doe@gmail.com',
              givenName: 'John',
              familyName: 'Doe',
              phone: '0760072513',
              facebookUrl: 'https://facebook.com',
              twitterUrl: 'https://twitter.com',
              instagramUrl: 'https://instagram.com',
              promotion: 'L1',
              location: 'Douai',
            },
            password: 'password',
            genres: [
              {
                id: 'd5e352dc-29a6-4a2d-a226-29d6866d1b5d',
                name: 'rock',
              },
              { id: '7d68d33c-3eff-4f5e-985b-c7d9e058e23a', name: 'metal' },
            ],
            instruments: [
              {
                id: 'cd836a31-1663-4a11-8a88-0a249aa70793',
                name: 'batterie',
              },
              {
                id: 'e345114e-7723-42eb-8ed1-f26cd2f9d084',
                name: 'guitare',
              },
            ],
          },
        },
      },
    },
    responses: {
      201: {
        description: 'The user has been registered in the db',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: { $ref: '#/components/schemas/token' },
                musician: { $ref: '#/components/schemas/musician' },
                genres: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/genre' },
                },
                instruments: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/instrument' },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default schema;
