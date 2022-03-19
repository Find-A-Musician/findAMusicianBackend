import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/groups/{groupId}/admins/transfer/{musicianId}',
  post: {
    operationId: 'transferGroupAdmin',
    tags: ['groups'],
    security: [{ BearerAuth: [] }],
    description: 'Transfer the admin membership to another member',
    parameters: [
      {
        in: 'path',
        name: 'groupId',
        schema: {
          type: 'string',
        },
        required: true,
        description: 'The ID of the group',
      },
      {
        in: 'path',
        name: 'musicianId',
        schema: {
          type: 'string',
        },
        required: true,
        description: 'The ID of the musician that will become the admin',
      },
    ],
    responses: {
      204: {
        description: 'The admin membership has been transfered',
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
        description: 'The musician is not a member of the group',
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
