import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/profil/notifications/{notificationId}',
  delete: {
    description: 'Delete a notification by its id',
    operationId: 'deleteNotificationById',
    tags: ['profil'],
    security: [{ BearerAuth: [] }],
    parameters: [
      {
        in: 'path',
        name: 'notificationId',
        required: true,
        schema: {
          type: 'string',
        },
        description: 'the id of the notification',
      },
    ],
    responses: {
      204: {
        description: 'The notification has been deleted',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
      404: {
        description: 'The notification does not exist',
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
