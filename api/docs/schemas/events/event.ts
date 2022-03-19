import { HandlerDefinition } from '../../../types/typing';

const schema: HandlerDefinition = {
  path: '/events/{eventId}',
  get: {
    operationId: 'getEventById',
    tags: ['events'],
    description: 'Get an event by his Id',
    security: [{ BearerAuth: [] }],
    parameters: [
      {
        in: 'path',
        name: 'eventId',
        schema: {
          type: 'string',
        },
        required: true,
        description: 'The ID of the event',
      },
    ],
    responses: {
      200: {
        description: 'The event information',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/event',
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
    },
  },
  delete: {
    operationId: 'deleteEventById',
    tags: ['events'],
    description: 'Delete an event by his Id',
    security: [{ BearerAuth: [] }],
    parameters: [
      {
        in: 'path',
        name: 'eventId',
        schema: {
          type: 'string',
        },
        required: true,
        description: 'The ID of the event',
      },
    ],
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
    },
  },
  patch: {
    operationId: 'patchEventById',
    tags: ['events'],
    description: 'Modify an event info',
    security: [{ BearerAuth: [] }],
    parameters: [
      {
        in: 'path',
        name: 'eventId',
        schema: {
          type: 'string',
        },
        required: true,
        description: 'The ID of the event',
      },
    ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
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
        },
      },
    },
    responses: {
      200: {
        description: 'The event has been modified',
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
    },
  },
};

export default schema;
