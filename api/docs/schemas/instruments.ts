import {HandlerDefinition} from 'api/types/typing';

const schema:HandlerDefinition = {
  'path': '/instruments',

  'get': {
    operationId: 'getInstruments',
    tags: ['instruments'],
    security: [
      {'BearerAuth': []},
    ],
    responses: {
      200: {
        description: 'A list of all the instruments',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/instrument',
              },
            },
          },
        },
      },
    },
  },
};


export default schema;
