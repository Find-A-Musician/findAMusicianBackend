import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/events',
  get: {
    operationId: 'getEvents',
    tags: ['events'],
    description: 'Get a list of all the events',
    parameters: [
      {
        in: 'query',
        name: 'name',
        required: false,
        schema: {
          type: 'string',
          example: 'imtremplin',
        },
        description: 'The query filter for the event name',
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
        description: 'The query filter for the event genre',
      },
      {
        in: 'query',
        name: 'startdate',
        required: false,
        schema: {
          type: 'string',
          format: 'date-time',
          example: '2022-03-11T20:23:51.992Z',
        },
        description: 'The query filter for the event startDate',
      },
      {
        in: 'query',
        name: 'enddate',
        required: false,
        schema: {
          type: 'string',
          format: 'date-time',
          example: '2022-03-12T20:23:51.992Z',
        },
        description: 'The query filter for the event endDate',
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
        description: 'The number of events returned',
      },
    ],
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: 'A list of all the events',
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
                    $ref: '#/components/schemas/event',
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
    operationId: 'postEvents',
    tags: ['events'],
    description: 'Post a new event',
    security: [{ BearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: [
              'name',
              'description',
              'startDate',
              'endDate',
              'adress',
              'genres',
            ],
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string' },
              startDate: { type: 'string', format: 'date-time' },
              endDate: { type: 'string', format: 'date-time' },
              adress: { type: 'string' },
              genres: {
                type: 'array',
                items: { $ref: '#/components/schemas/genre' },
              },
            },
          },
          example: {
            name: 'Insane event',
            description: 'An insane event',
            startDate: '2022-03-13T16:00:28.015Z',
            endDate: '2022-03-13T16:00:28.015Z',
            adress: 'somewhere',
            genres: [
              {
                id: 'id',
                name: 'rock',
              },
            ],
          },
        },
      },
    },
    responses: {
      201: {
        description: 'The event has been created',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/event',
            },
          },
        },
      },
      409: {
        description: 'The Event already exist',
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
