import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/events',
  get: {
    operationId: 'getEvents',
    tags: ['events'],
    description: 'Get a list of all the events',
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: 'A list of all the events',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: { $ref: '#/components/schemas/event' },
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
            startDate: new Date(Date.now()),
            endDate: new Date(Date.now()),
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
      401: {
        description: 'Event already created',
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
