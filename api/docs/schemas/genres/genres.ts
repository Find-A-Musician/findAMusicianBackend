import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/genres',

  get: {
    operationId: 'getGenres',
    description: 'Get a list of all genres',
    tags: ['genres'],
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
