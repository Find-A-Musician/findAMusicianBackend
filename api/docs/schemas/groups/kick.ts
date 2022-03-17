import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/groups/{groupId}/kick/{musicianId}',
  delete: {
    operationId: 'groupKickMusician',
    tags: ['groups'],
    security: [{ BearerAuth: [] }],
    description: 'Kick a member from a group',
    parameters: [
      {
        in: 'path',
        name: 'groupId',
        required: true,
        schema: {
          type: 'string',
        },
        description: 'the Id of the group',
      },
      {
        in: 'path',
        name: 'musicianId',
        required: true,
        schema: {
          type: 'string',
        },
        description: 'the Id of the musician to kick',
      },
    ],
    responses: {
      204: {
        description: 'The musician has been kicked from the group',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
      403: {
        description: 'The user does not have the right',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/httpError',
            },
          },
        },
      },
      404: {
        description: 'The musician is not in the group',
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
