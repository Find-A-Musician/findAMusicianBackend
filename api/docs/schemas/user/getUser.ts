import {HandlerDefinition} from '../../../../typing';

const schema:HandlerDefinition = {
  get: {
    tags: ['test'],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              id: {type: 'string'},
            },
          },
          example: {
            id: 'an id',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'good',
      },
    },
  },
};

export default schema;
