import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/groups',
  get: {
    operationId: 'getGroups',
    tags: ['groups'],
    description: 'Get a list of all the groups',
    security: [{ BearerAuth: [] }],
    parameters: [
      {
        in: 'query',
        name: 'name',
        required: false,
        schema: {
          type: 'string',
          example: 'Periphery',
        },
        description: 'The query filter for the group name',
      },
      {
        in: 'query',
        required: false,
        name: 'location',
        schema: {
          type: 'array',
          items: {
            type: 'string',
          },
          example: ['Douai'],
        },
        description: 'The query filter for the group location',
      },
      {
        in: 'query',
        name: 'genres',
        required: false,
        schema: {
          type: 'array',
          items: {
            type: 'string',
          },
          example: ['rock', 'jazz'],
        },
        description: 'The query filter for group genre',
      },
      {
        in: 'query',
        name: 'start',
        required: false,
        schema: {
          type: 'number',
          example: 0,
        },
        description: 'The start index of the query',
      },
      {
        in: 'query',
        name: 'limit',
        required: false,
        schema: {
          type: 'number',
          example: 20,
        },
        description: 'The number of groups returned',
      },
    ],
    responses: {
      200: {
        description: 'An array of groups',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: [
                'results',
                '_links',
                'size',
                'limit',
                'start',
                'total',
              ],
              properties: {
                _links: {
                  $ref: '#/components/schemas/_links',
                },
                results: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/group',
                  },
                },
                size: { type: 'number' },
                limit: { type: 'number' },
                total: { type: 'number' },
                start: { type: 'number' },
              },
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
                $ref: '#/components/schemas/groupDescription',
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
              $ref: '#/components/schemas/group',
            },
          },
        },
      },
      409: {
        description: 'The group already exist',
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
