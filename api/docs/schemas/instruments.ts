import {HandlerDefinition} from '@typing';

const schema:HandlerDefinition = {
  'get': {
    operationId: 'getInstruments',
    tags: ['instruments'],
    responses: {
      200: {
        description: 'A list of all the instruments',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/instruments',
              },
            },
          },
        },
      },
    },
  },
};


export default schema;
