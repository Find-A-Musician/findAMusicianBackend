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
        schema: {
          type: 'string',
          example: 'Romain',
        },
        description: 'The query filter for name',
      },
      {
        in: 'query',
        name: 'genres',
        schema: {
          type: 'array',
          items: {
            type: 'string',
          },
          example: ['Rock', 'Jazz'],
        },
        description: 'The query filter for genre',
      },
      {
        in: 'query',
        name: 'instruments',
        schema: {
          type: 'array',
          items: {
            type: 'string',
          },
          example: ['piano', 'guitar'],
        },
        description: 'The query filter for instruments',
      },
      {
        in: 'query',
        name: 'location',
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
