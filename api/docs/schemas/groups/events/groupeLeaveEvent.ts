import { HandlerDefinition } from '../../../../types/typing';

const schema: HandlerDefinition = {
  path: '/groups/event/leave',
  post: {
    operationId: 'groupLeaveEvent',
    description: 'A group leaves an event',
    security: [{ BearerAuth: [] }],
    tags: ['groups'],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              groupId: { type: 'string' },
              eventId: { type: 'string' },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'The group has left the event',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
      404: {
        description: 'The group or event does not exist',
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
