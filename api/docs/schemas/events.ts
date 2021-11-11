import { HandlerDefinition } from 'api/types/typing';

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
            $ref: '#/components/schemas/event',
          },
          example: {
            name: 'Insane event',
            description: 'An insane event',
            start_date: new Date(Date.now()),
            end_date: new Date(Date.now()),
            adress: 'somewhere',
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
              type: 'string',
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
