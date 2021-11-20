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
  patch: {
    operationId: 'patchEvent',
    tags: ['events'],
    description: 'Modify an event info',
    security: [{ BearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/event',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'The event has been deleted',
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
        description: 'The event does not exist',
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
    operationId: 'deleteEvents',
    tags: ['events'],
    description: 'Delete an event',
    security: [{ BearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['event'],
            properties: {
              event: { type: 'string' },
            },
            example: {
              event: '1f8e6640-8074-4525-997d-808f304b52e8',
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'The event has been deleted',
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
        description: 'The event does not exist',
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
