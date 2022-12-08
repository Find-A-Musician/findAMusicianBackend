import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/profil/invitations',
  post: {
    operationId: 'postUserToGroupInvitation',
    tags: ['profil'],
    security: [{ BearerAuth: [] }],
    description: 'Post a new invitation from the logged user to a group',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['groupId', 'instruments'],
            properties: {
              groupId: { type: 'string' },
              instruments: {
                type: 'array',
                items: { $ref: '#/components/schemas/instrument' },
              },
              description: { type: 'string', nullable: true },
            },
          },
        },
      },
    },
    responses: {
      201: {
        description: 'The invitation has been sent',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/httpError',
            },
          },
        },
      },
      200: {
        description: 'The invitation has been updated',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/httpError',
            },
          },
        },
      },
      422: {
        description: 'the user is already in the group',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/httpError',
            },
          },
        },
      },
      404: {
        description: 'the group does not exist',
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
