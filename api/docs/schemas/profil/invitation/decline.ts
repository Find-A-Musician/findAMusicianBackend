import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/profil/invitations/{invitationId}/decline',
  delete: {
    operationId: 'declineProfilInvitation',
    tags: ['profil'],
    security: [{ BearerAuth: [] }],
    description: 'Decline an invitation than the logged user received',
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
