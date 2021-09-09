import {HandlerDefinition} from '@typing';


const schema:HandlerDefinition = {
  'post': {
    operationId: 'register',
    tags: ['user'],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            allOf: [
              {$ref: '#/components/schemas/musician'},
              {
                type: 'object',
                required: ['password'],
                properties: {
                  password: {type: 'string'},
                },
              },
            ],
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
              properties: {
                token: {type: 'string'},
                refreshToken: {type: 'string'},
              },
            },
          },
        },
      },
    },
  },
};

export default schema;
