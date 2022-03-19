import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/groups/{groupId}/admins/lite_admins/{musicianId}',
  post: {
    operationId: 'addGroupLiteAdmin',
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
      {
        in: 'path',
        name: 'musicianId',
        schema: {
          type: 'string',
        },
        required: true,
        description:
          'The ID of the musician that receive lite_admin membership',
      },
    ],
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
  delete: {
    operationId: 'removeGroupLiteAdmin',
    tags: ['groups'],
    security: [{ BearerAuth: [] }],
    description: 'Remove a group member the lite_admin membership',
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
      {
        in: 'path',
        name: 'musicianId',
        schema: {
          type: 'string',
        },
        required: true,
        description:
          'The ID of the musician that receive lite_admin membership',
      },
    ],
    responses: {
      204: {
        description:
          'The lite_admin membership has been removed from the group member',
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
        description: 'The musician is not a lite_admin of the group',
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
