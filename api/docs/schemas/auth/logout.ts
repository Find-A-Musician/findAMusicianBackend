import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/logout',
  delete: {
    operationId: 'logout',
    tags: ['auth'],
    description: 'Logout the current user',
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: 'All the token has been deleted',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};

export default schema;
