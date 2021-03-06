import { HandlerDefinition } from '../../../types/typing';

const schema: HandlerDefinition = {
  path: '/info',
  get: {
    operationId: 'getApplicationInfo',
    tags: ['information'],
    description: 'Return the basic information of the app',
    responses: {
      200: {
        description: 'The basic information about the app',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                nbMusician: { type: 'number' },
                nbGroups: { type: 'number' },
                nbEvents: { type: 'number' },
              },
            },
          },
        },
      },
    },
  },
};

export default schema;
