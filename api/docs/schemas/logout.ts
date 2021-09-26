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
      },
    },
  },
};

export default schema;
