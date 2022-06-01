import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/groups/{groupId}/invitations/sent',
  get: {
    operationId: 'getGroupInvitationSent',
    tags: ['groups'],
    security: [{ BearerAuth: [] }],
    description: 'Get all the invitation that the group sent to musicians',
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
    ],
    responses: {
      200: {
        description: 'The invitations sent by the group',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/invitation',
              },
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
        description: 'The group does not exist',
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
