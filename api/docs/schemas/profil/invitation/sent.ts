import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/profil/invitations/sent',
  get: {
    operationId: 'getUserInvitationSent',
    tags: ['profil'],
    security: [{ BearerAuth: [] }],
    description: 'Get all the invitation sent by the logged user',
    responses: {
      200: {
        description: 'The invitations sent by the logged user',
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
    },
  },
};

export default schema;
