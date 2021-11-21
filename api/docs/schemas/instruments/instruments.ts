import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/instruments',

  get: {
    operationId: 'getInstruments',
    tags: ['instruments'],
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: 'A list of all the instruments',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/instrument',
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
