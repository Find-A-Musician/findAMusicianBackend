import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/groups',
  get: {
    operationId: 'getGroups',
    tags: ['groups'],
    description: 'Get a list of all the groups',
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: 'An array of groups',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'object',
                required: ['groupInformation', 'groupMembers'],
                properties: {
                  groupInformation: { $ref: '#/components/schemas/group' },
                  groupMembers: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/groupMember',
                    },
                  },
                },
              },
            },
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
