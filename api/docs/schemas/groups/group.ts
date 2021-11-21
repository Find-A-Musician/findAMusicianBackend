import { HandlerDefinition } from '../../../types/typing';

const schema: HandlerDefinition = {
  path: '/groups/{groupId}',
  get: {
    operationId: 'getGroupsById',
    tags: ['groups'],
    security: [{ BearerAuth: [] }],
    description: "Get a group information by it's Id",
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
    responses: {
      200: {
        description: 'The group information',
        content: {
          'application/json': {
            schema: {
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
      404: {
        description: 'The group does not exist',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/httpError',
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
  patch: {
    operationId: 'patchGroupsById',
    description: "Patch a group by it's Id",
    security: [{ BearerAuth: [] }],
    tags: ['groups'],
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
            $ref: '#/components/schemas/group',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'The group has been deleted',
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
        description: 'The group does not exist',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/httpError',
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
  delete: {
    operationId: 'deleteGroupsById',
    description: "Delete a group by it's Id",
    security: [{ BearerAuth: [] }],
    tags: ['groups'],
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
    responses: {
      200: {
        description: 'The group has been deleted',
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
        description: 'The group does not exist',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/httpError',
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
