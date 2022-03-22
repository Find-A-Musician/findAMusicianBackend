import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/profil/notifications',
  get: {
    description: 'Get all the notications of the user',
    operationId: 'getNotifications',
    tags: ['profil'],
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: 'The user profil information',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/notification',
              },
            },
          },
        },
      },
    },
  },
};

export default schema;
