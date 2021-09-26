import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/me',
  get: {
    description: 'Get the user connected information',
    operationId: 'me',
    tags: ['musician'],
    security: [{ BearerAuth: [] }],
    responses: {
      '200': {
        description: 'The user information',
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
};

export default schema;
