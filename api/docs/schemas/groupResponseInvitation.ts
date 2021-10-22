import { HandlerDefinition } from 'api/types/typing';

const schema: HandlerDefinition = {
  path: '/groups/invitation/response',
  post: {
    operationId: 'responseGroupInvitation',
    tags: ['groups'],
    description: 'Respond to a group invitation',
    security: [{ BearerAuth: [] }],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['groupId', 'response'],
            properties: {
              groupId: { type: 'string' },
              response: { type: 'string', enum: ['declined', 'member'] },
            },
            example: {
              groupId: '0bc1164f-c92b-48f3-aadf-a2be610819d8',
              response: 'member',
            },
          },
        },
      },
    },
    responses: {
      201: {
        description: 'The user membershhip has been updated',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
      401: {
        description: "User can't respond to this invitation",
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/httpError' },
          },
        },
      },
      400: {
        description: 'The user has already responded',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/httpError' },
          },
        },
      },
      500: {
        description: 'Error intern server',
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
