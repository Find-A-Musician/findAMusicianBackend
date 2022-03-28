import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/groups/{groupId}/invitations',
  post: {
    operationId: 'postGroupToUserInvitation',
    tags: ['groups'],
    security: [{ BearerAuth: [] }],
    description: 'Post a new invitation from a group to a user',
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
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['musicianId', 'instruments'],
            properties: {
              musicianId: { type: 'string' },
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
        description: 'the musician does not exist',
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
