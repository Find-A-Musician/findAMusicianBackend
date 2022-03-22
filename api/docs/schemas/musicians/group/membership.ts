import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/musicians/{musicianId}/groups/{groupId}/membership',
  get: {
    operationId: 'getMusicianGroupMembership',
    description: 'Get the membership of a musician in a group',
    security: [{ BearerAuth: [] }],
    tags: ['musician'],
    parameters: [
      {
        in: 'path',
        name: 'musicianId',
        schema: {
          type: 'string',
        },
        required: true,
        description: 'The ID of the muscician',
      },
      {
        in: 'path',
        name: 'groupId',
        schema: {
          type: 'string',
        },
        required: true,
        description: 'The ID of the group',
      },
    ],
    responses: {
      200: {
        description: 'The membership of the musician',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['membership'],
              properties: {
                membership: { type: 'string' },
              },
            },
          },
        },
      },

      404: {
        description: 'The group or musician does not exist',
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
