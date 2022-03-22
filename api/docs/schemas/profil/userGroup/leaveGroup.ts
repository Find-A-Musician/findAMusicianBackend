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
    requestBody: {
      required: false,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              musicianId: {
                type: 'string',
                description:
                  "The id of the musician that will become the new admin of the group, only if it's the admin that is leaving the group",
              },
            },
          },
        },
      },
    },
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
      400: {
        description: 'The body is required for an admin leaving an event',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/httpError',
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
    },
  },
};

export default schema;
