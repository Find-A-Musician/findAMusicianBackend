import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/groups/{groupId}/admins/lite_admins',
  put: {
    operationId: 'addGroupLiteAdmins',
    tags: ['groups'],
    security: [{ BearerAuth: [] }],
    description: 'Give a group member the lite_admin membership',
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
            required: ['lite_admins'],
            type: 'object',
            properties: {
              lite_admins: {
                type: 'array',
                items: {
                  type: 'string',
                  description: 'The ID of the musician',
                },
              },
            },
          },
        },
      },
    },
    responses: {
      204: {
        description: 'The musician became a lite_admin',
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
        description: 'The musician is not a member of the group',
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
