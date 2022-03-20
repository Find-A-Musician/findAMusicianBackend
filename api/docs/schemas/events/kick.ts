import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/events/{eventId}/kick/{groupId}',
  delete: {
    operationId: 'eventKickGroup',
    tags: ['events'],
    security: [{ BearerAuth: [] }],
    description: 'Delete a group from an event',
    parameters: [
      {
        in: 'path',
        name: 'eventId',
        schema: {
          type: 'string',
        },
        required: true,
        description: 'The ID of the event',
      },
      {
        in: 'path',
        name: 'groupId',
        schema: {
          type: 'string',
        },
        required: true,
        description: 'The ID of the group to kick',
      },
    ],
    responses: {
      '204': {
        description: 'The musician has been kicked from the group',
        content: { 'application/json': { schema: { type: 'string' } } },
      },
      '403': {
        description: 'The user does not have the right',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/httpError' },
          },
        },
      },
      '404': {
        description: 'The musician is not in the group',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/httpError' },
          },
        },
      },
    },
  },
};

export default schema;
