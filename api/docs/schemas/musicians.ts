import {HandlerDefinition} from '@typing';

const schema : HandlerDefinition = {
  'get': {
    operationId: 'getMusicians',
    tags: ['musician'],
    security: [
      {'bearerAuth': []},
    ],
    responses: {
      200: {
        description: 'A list of all the musicians',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/musician',
              },
            },
          },
        },
      },
    },
  },
};

export default schema;
