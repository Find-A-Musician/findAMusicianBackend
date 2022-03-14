import { HandlerDefinition } from '../../../types/typing';

const schema: HandlerDefinition = {
  path: '/events/admins',
  post: {
    operationId: 'addEventAdmin',
    description: 'Add a musician as an admin of an event',
    tags: ['events'],
    security: [{ BearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['eventId', 'musicianId'],
            properties: {
              eventId: {
                type: 'string',
              },
              musicianId: {
                type: 'string',
              },
            },
          },
          example: {
            eventId: '40f88342-dfb8-4cfb-b12c-7946af2f3fab',
            musicianId: '5154dd2b-5aaa-4592-ab74-ffdb2637593c',
          },
        },
      },
    },
    responses: {
      200: {
        description: "The musician has been added to the event's admins",
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/event',
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
        description: 'The event or the musician does not exist',
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
