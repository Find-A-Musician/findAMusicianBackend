import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/musicians',

  get: {
    operationId: 'getMusicians',
    tags: ['musician'],
    security: [{ BearerAuth: [] }],
    parameters: [
      {
        in: 'query',
        name: 'name',
        required: false,
        schema: {
          type: 'string',
          example: 'Romain',
        },
        description: 'The query filter for name',
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
        description: 'The query filter for genre',
      },
      {
        in: 'query',
        name: 'instruments',
        required: false,
        schema: {
          type: 'array',
          items: {
            type: 'string',
          },
          example: ['piano', 'guitare'],
        },
        description: 'The query filter for instruments',
      },
      {
        in: 'query',
        name: 'location',
        required: false,
        schema: {
          type: 'array',
          items: {
            type: 'string',
          },
          example: ['Douai'],
        },
        description: 'The query filter for location',
      },
      {
        in: 'query',
        name: 'promotion',
        required: false,
        schema: {
          type: 'array',
          items: {
            type: 'string',
          },
          example: ['M1'],
        },
        description: 'The query filter for promotion',
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
        description: 'The number of musicians returned',
      },
    ],
    responses: {
      200: {
        description: 'A list of all the musicians informations',
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
                    $ref: '#/components/schemas/musician',
                  },
                },
                size: { type: 'number' },
                limit: { type: 'number' },
                start: { type: 'number' },
                total: { type: 'number' },
              },
            },
          },
        },
      },
    },
  },
};

export default schema;
