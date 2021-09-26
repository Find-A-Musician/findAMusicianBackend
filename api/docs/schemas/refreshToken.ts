import { HandlerDefinition } from 'api/types/typing';

const schema: HandlerDefinition = {
  path: '/refresh_token',

  post: {
    operationId: 'postRefreshToken',
    description: 'Send a new access token',
    tags: ['auth'],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['refreshToken'],
            properties: {
              refreshToken: { type: 'string' },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'a new access token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['accessToken'],
              properties: {
                accessToken: { type: 'string' },
              },
            },
          },
        },
      },
      401: {
        description: 'Invalid refresh token',
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
