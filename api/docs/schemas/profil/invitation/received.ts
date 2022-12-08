import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/profil/invitations/received',
  get: {
    operationId: 'getUserInvitationReceived',
    tags: ['profil'],
    security: [{ BearerAuth: [] }],
    description: 'Get all the invitation received by the logged user',
    responses: {
      200: {
        description: 'The invitations received by the logged user',
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
