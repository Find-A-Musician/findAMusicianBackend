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
            email: 'john.doe@gmail.com',
            password: 'password',
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
    },
  },
};

export default schema;
