import { HandlerDefinition } from 'api/types/typing';

const schema: HandlerDefinition = {
  path: '/login',

  post: {
    operationId: 'login',
    tags: ['auth'],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email' },
              password: { type: 'string' },
            },
          },
          example: {
            email: 'romain.guar01@gmail.com',
            password: 'romain123',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Login successful',
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
      400: {
        description: 'The user is not find',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/httpError',
            },
          },
        },
      },
      401: {
        description: 'invalid password',
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
