import { HandlerDefinition } from 'api/types/typing';

const schema: HandlerDefinition = {
  path: '/musicians',

  get: {
    operationId: 'getMusicians',
    tags: ['musician'],
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: 'A list of all the musicians informations',
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
