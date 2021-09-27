import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/profil',
  get: {
    description: 'Get the user connected profil',
    operationId: 'getProfil',
    tags: ['profil'],
    security: [{ BearerAuth: [] }],
    responses: {
      '200': {
        description: 'The user profil information',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['musician', 'password', 'genres', 'instruments'],
              properties: {
                musician: {
                  $ref: '#/components/schemas/musician',
                },
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

  patch: {
    operationId: 'patchProfil',
    tags: ['profil'],
    security: [{ BearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                format: 'email',
              },
              givenName: { type: 'string' },
              familyName: { type: 'string' },
              phone: { type: 'string' },
              facebookUrl: { type: 'string' },
              twitterUrl: { type: 'string' },
              instagramUrl: { type: 'string' },
              promotion: {
                type: 'string',
                enum: ['L1', 'L2', 'L3', 'M1', 'M2'],
              },
              location: { type: 'string', enum: ['Douai', 'Lille'] },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'The musician information has been updated',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
      403: {
        description: 'user is unauthorized',
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
