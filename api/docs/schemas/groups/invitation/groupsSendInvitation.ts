import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/groups/invitation/send',
  post: {
    operationId: 'sendGroupInvitation',
    tags: ['groups'],
    description: 'Invite a musician in a group',
    security: [{ BearerAuth: [] }],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['groupId', 'musicianId', 'instrumentId', 'role'],
            properties: {
              groupId: { type: 'string' },
              musicianId: { type: 'string' },
              instrumentId: { type: 'string' },
              role: { type: 'string', enum: ['lite_admin', 'member'] },
            },
          },
          example: {
            groupId: '0bc1164f-c92b-48f3-aadf-a2be610819d8',
            musicianId: '8c9a685a-2be9-4cf0-a03c-0b316fc4b515',
            instrumentId: 'cd836a31-1663-4a11-8a88-0a249aa70793',
            role: 'member',
          },
        },
      },
    },
    responses: {
      201: {
        description: 'The user has been invited',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
      401: {
        description: "User that invite doesn't have the access",
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/httpError' },
          },
        },
      },
      400: {
        description: 'The user is already invited',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/httpError' },
          },
        },
      },
    },
  },
};

export default schema;
