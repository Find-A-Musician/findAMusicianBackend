import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/profil/invitations/{invitationId}',
  delete: {
    operationId: 'deleteProfilInvitationById',
    tags: ['profil'],
    security: [{ BearerAuth: [] }],
    description: 'Delete a musician to group invitation by its id',
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
        description: 'The invitations hbas been deleted',
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
