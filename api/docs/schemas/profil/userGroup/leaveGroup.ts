import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/profil/groups/{groupId}/leave',
  post: {
    description: 'Leave a group',
    operationId: 'leaveGroup',
    tags: ['profil'],
    security: [{ BearerAuth: [] }],
    parameters: [
      {
        in: 'path',
        name: 'groupId',
        schema: {
          type: 'string',
        },
        required: true,
        description: 'The id of the group to leave',
      },
    ],
    responses: {
      200: {
        description: 'The user have leaved the group',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
      404: {
        description: 'This user is not in this group',
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
