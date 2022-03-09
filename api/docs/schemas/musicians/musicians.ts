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
    ],
    responses: {
      200: {
        description: 'A list of all the musicians informations',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/musician',
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
