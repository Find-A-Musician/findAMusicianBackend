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
        description: 'The user notifications',
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
  delete: {
    description: 'Delete all the notications of the user',
    operationId: 'deleteAllNotifications',
    tags: ['profil'],
    security: [{ BearerAuth: [] }],
    responses: {
      204: {
        description: 'All the notifications has been deleted',
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
