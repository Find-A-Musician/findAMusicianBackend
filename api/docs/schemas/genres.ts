import {HandlerDefinition} from '@typing';

const schema:HandlerDefinition = {
  'get': {
    operationId: 'getGenres',
    description: 'Get a list of all genres',
    tags: ['genres'],
    security: [
      {'BearerAuth': []},
    ],
    responses: {
      200: {
        description: 'A list of all genres',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/genre',
              },
            },
          },
        },
      },
    },
  },
};

export default schema;
