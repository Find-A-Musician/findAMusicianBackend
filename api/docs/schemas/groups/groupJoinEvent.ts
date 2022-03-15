import { HandlerDefinition } from '../../../types/typing';

const schema: HandlerDefinition = {
  path: '/groups/joinEvent',
  patch: {
    operationId: 'groupJoinEvent',
    description: 'A group joins an event',
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
        description: 'The group has joined the event',
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
