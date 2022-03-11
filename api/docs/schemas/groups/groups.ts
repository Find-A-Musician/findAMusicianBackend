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
                required: [
                  'id',
                  'name',
                  'description',
                  'location',
                  'genres',
                  'members',
                ],
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  location: { type: 'string', enum: ['Douai', 'Lille'] },
                  genres: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/genre' },
                  },
                  members: {
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
  post: {
    description: 'Create a new group',
    operationId: 'createGroup',
    tags: ['groups'],
    security: [{ BearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['group', 'instruments'],
            properties: {
              group: {
                $ref: '#/components/schemas/group',
              },

              instruments: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/instrument',
                },
              },
            },
          },
          example: {
            group: {
              name: 'Red Mustard',
              description: 'the craziest group ever',
              location: 'Lille',
              genres: [
                {
                  id: 'd5e352dc-29a6-4a2d-a226-29d6866d1b5d',
                  name: 'rock',
                },
              ],
            },
            instruments: [
              {
                id: 'cd836a31-1663-4a11-8a88-0a249aa70793',
                name: 'batterie',
              },
            ],
          },
        },
      },
    },
    responses: {
      201: {
        description: 'The group has been created',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
      422: {
        description: 'An error in the request body',
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
