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
            required: [
              'email',
              'givenName',
              'familyName',
              'promotion',
              'location',
              'instruments',
              'genres',
              'password',
            ],
            properties: {
              email: {
                type: 'string',
                format: 'email',
              },
              givenName: { type: 'string' },
              familyName: { type: 'string' },
              phone: { type: 'string', nullable: true },
              facebookUrl: { type: 'string', nullable: true },
              twitterUrl: { type: 'string', nullable: true },
              instagramUrl: { type: 'string', nullable: true },
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
              password: { type: 'string' },
            },
          },
          example: {
            email: 'john.doe@gmail.com',
            givenName: 'John',
            familyName: 'Doe',
            phone: '0760072513',
            facebookUrl: 'https://facebook.com',
            twitterUrl: 'https://twitter.com',
            instagramUrl: 'https://instagram.com',
            promotion: 'L1',
            location: 'Douai',
            genres: [
              {
                id: '8613b998-f7ed-406b-ac8c-181002940956',
                name: 'metal',
              },
              {
                id: '5eef2f80-3690-439e-9e38-fcfa9060bc4a',
                name: 'rock',
              },
            ],
            instruments: [
              {
                id: 'e74667de-787e-41d9-8b4d-0a1890b9eabb',
                name: 'guitare',
              },
              {
                id: '6d33bf78-b9c8-4887-b586-aab22f038e0d',
                name: 'piano',
              },
            ],
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
      409: {
        description: 'The user already exist',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/httpError',
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
