import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/test',
  get: {
    operationId: 'test',
    tags: ['test'],
    description: 'A simple get route for testing',
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: 'The test has been a success',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['userId'],
              properties: {
                userId: { type: 'string' },
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
      401: {
        description: 'Token not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/httpError',
            },
          },
        },
      },
      403: {
        description: 'Invalid token',
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
