import {HandlerDefinition} from '@typing';

const schema:HandlerDefinition ={
  'post': {
    operationId: 'login',
    tags: ['auth'],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {type: 'string', format: 'email'},
              password: {type: 'string'},
            },
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
              allOf: [
                {$ref: '#/components/schemas/token'},
                {$ref: '#/components/schemas/musician'},
              ],
            },
          },
        },
      },
    },
  },
};

export default schema;