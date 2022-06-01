import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/groups/{groupId}/invitations/{invitationId}/decline',
  delete: {
    operationId: 'declineGroupInvitation',
    tags: ['groups'],
    security: [{ BearerAuth: [] }],
    description: 'Decline an invitation than a group received',
    parameters: [
      {
        in: 'path',
        description: 'the invitation id',
        name: 'invitationId',
        schema: {
          type: 'string',
        },
        required: true,
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
      204: {
        description: 'The invitations has been declined',
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
        description: 'the invitation does not exist',
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
