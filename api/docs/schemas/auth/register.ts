import { HandlerDefinition } from '@typing';

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
            required: ['musician', 'password'],
            properties: {
              musician: {
                type: 'object',
                required: [
                  'email',
                  'givenName',
                  'familyName',
                  'promotion',
                  'location',
                  'instruments',
                  'genres',
                  'facebook_url',
                  'twitter_url',
                  'instagram_url',
                ],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                  },
                  givenName: { type: 'string' },
                  familyName: { type: 'string' },
                  phone: { type: 'string', nullable: true },
                  facebook_url: { type: 'string', nullable: true },
                  twitter_url: { type: 'string', nullable: true },
                  instagram_url: { type: 'string', nullable: true },
                  promotion: {
                    type: 'string',
                    enum: ['L1', 'L2', 'L3', 'M1', 'M2'],
                  },
                  location: { type: 'string', enum: ['Douai', 'Lille'] },
                  instruments: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/instrument',
                    },
                  },
                  genres: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/genre',
                    },
                  },
                },
              },
              password: { type: 'string' },
            },
          },
          example: {
            musician: {
              email: 'john.doe@gmail.com',
              givenName: 'John',
              familyName: 'Doe',
              phone: '0760072513',
              facebook_url: 'https://facebook.com',
              twitter_url: 'https://twitter.com',
              instagram_url: 'https://instagram.com',
              promotion: 'L1',
              location: 'Douai',
              genres: [
                {
                  id: 'd5e352dc-29a6-4a2d-a226-29d6866d1b5d',
                  name: 'Rock',
                },
                { id: '7d68d33c-3eff-4f5e-985b-c7d9e058e23a', name: 'Metal' },
              ],
              instruments: [
                {
                  id: 'cd836a31-1663-4a11-8a88-0a249aa70793',
                  name: 'drums',
                },
                {
                  id: 'e345114e-7723-42eb-8ed1-f26cd2f9d084',
                  name: 'guitar',
                },
              ],
            },
            password: 'password',
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
              required: ['token', 'musician'],
              properties: {
                token: { $ref: '#/components/schemas/token' },
                musician: { $ref: '#/components/schemas/musician' },
              },
            },
          },
        },
      },
      500: {
        description: 'Error intern server',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/httpError',
            },
          },
        },
      },
    },
  },
};

export default schema;
