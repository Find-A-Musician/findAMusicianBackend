import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';
const openApiDocs: OpenAPIV3.Document = {
  paths: {
    '/login': {
      post: {
        operationId: 'login',
        tags: ['auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
              example: {
                email: 'romain.guar91@gmail.com',
                password: 'romain123',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['token', 'musician'],
                  properties: {
                    token: { $ref: '#/components/schemas/token' },
                    musician: { $ref: '#/components/schemas/musician' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'The user is not find',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
          '401': {
            description: 'invalid password',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
        },
      },
    },
    '/logout': {
      delete: {
        operationId: 'logout',
        tags: ['auth'],
        description: 'Logout the current user',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'All the token has been deleted',
            content: { 'application/json': { schema: { type: 'string' } } },
          },
        },
      },
    },
    '/refresh_token': {
      post: {
        operationId: 'postRefreshToken',
        description: 'Send a new access token',
        tags: ['auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: { refreshToken: { type: 'string' } },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'a new access token',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['accessToken'],
                  properties: { accessToken: { type: 'string' } },
                },
              },
            },
          },
          '401': {
            description: 'Invalid refresh token',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
        },
      },
    },
    '/register': {
      post: {
        operationId: 'register',
        tags: ['auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: [
                  'email',
                  'givenName',
                  'familyName',
                  'promotion',
                  'location',
                  'instruments',
                  'genres',
                  'password',
                ],
                properties: {
                  email: { type: 'string', format: 'email' },
                  givenName: { type: 'string' },
                  familyName: { type: 'string' },
                  phone: { type: 'string', nullable: true },
                  facebookUrl: { type: 'string', nullable: true },
                  twitterUrl: { type: 'string', nullable: true },
                  instagramUrl: { type: 'string', nullable: true },
                  promotion: {
                    type: 'string',
                    enum: ['L1', 'L2', 'L3', 'M1', 'M2'],
                  },
                  location: { type: 'string', enum: ['Douai', 'Lille'] },
                  instruments: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/instrument' },
                  },
                  genres: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/genre' },
                  },
                  password: { type: 'string' },
                },
              },
              example: {
                email: 'john.doe@gmail.com',
                givenName: 'John',
                familyName: 'Doe',
                phone: '0760072513',
                facebookUrl: 'https://facebook.com',
                twitterUrl: 'https://twitter.com',
                instagramUrl: 'https://instagram.com',
                promotion: 'L1',
                location: 'Douai',
                genres: [
                  { id: '8613b998-f7ed-406b-ac8c-181002940956', name: 'metal' },
                  { id: '5eef2f80-3690-439e-9e38-fcfa9060bc4a', name: 'rock' },
                ],
                instruments: [
                  {
                    id: 'e74667de-787e-41d9-8b4d-0a1890b9eabb',
                    name: 'guitare',
                  },
                  { id: '6d33bf78-b9c8-4887-b586-aab22f038e0d', name: 'piano' },
                ],
                password: 'password',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'The user has been registered in the db',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['token', 'musician'],
                  properties: {
                    token: { $ref: '#/components/schemas/token' },
                    musician: { $ref: '#/components/schemas/musician' },
                  },
                },
              },
            },
          },
          '409': {
            description: 'The user already exist',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
        },
      },
    },
    '/events/admins': {
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
                  eventId: { type: 'string' },
                  musicianId: { type: 'string' },
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
          '200': {
            description: "The musician has been added to the event's admins",
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/event' },
              },
            },
          },
          '403': {
            description: 'The user does not have the right',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
          '404': {
            description: 'The event or the musician does not exist',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
        },
      },
    },
    '/events/{eventId}': {
      get: {
        operationId: 'getEventById',
        tags: ['events'],
        description: 'Get an event by his Id',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'eventId',
            schema: { type: 'string' },
            required: true,
            description: 'The ID of the event',
          },
        ],
        responses: {
          '200': {
            description: 'The event information',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/event' },
              },
            },
          },
          '404': {
            description: 'The event does not exist',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
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
            schema: { type: 'string' },
            required: true,
            description: 'The ID of the event',
          },
        ],
        responses: {
          '200': {
            description: 'The event has been deleted',
            content: { 'application/json': { schema: { type: 'string' } } },
          },
          '403': {
            description: 'The user does not have the right',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
          '404': {
            description: 'The event does not exist',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
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
            schema: { type: 'string' },
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
          '200': {
            description: 'The event has been modified',
            content: { 'application/json': { schema: { type: 'string' } } },
          },
          '403': {
            description: 'The user does not have the right',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
          '404': {
            description: 'The event does not exist',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
        },
      },
    },
    '/events': {
      get: {
        operationId: 'getEvents',
        tags: ['events'],
        description: 'Get a list of all the events',
        parameters: [
          {
            in: 'query',
            name: 'name',
            required: false,
            schema: { type: 'string', example: 'imtremplin' },
            description: 'The query filter for the event name',
          },
          {
            in: 'query',
            name: 'genres',
            required: false,
            schema: {
              type: 'array',
              items: { type: 'string' },
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
            schema: { type: 'number', example: 0 },
            description: 'The start index of the query',
          },
          {
            in: 'query',
            name: 'limit',
            required: false,
            schema: { type: 'number', example: 20 },
            description: 'The number of events returned',
          },
        ],
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
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
                    _links: { $ref: '#/components/schemas/_links' },
                    results: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/event' },
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
                genres: [{ id: 'id', name: 'rock' }],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'The event has been created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/event' },
              },
            },
          },
          '409': {
            description: 'The Event already exist',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
        },
      },
    },
    '/events/{eventId}/kick/{groupId}': {
      delete: {
        operationId: 'eventKickGroup',
        tags: ['events'],
        security: [{ BearerAuth: [] }],
        description: 'Delete a group from an event',
        parameters: [
          {
            in: 'path',
            name: 'eventId',
            schema: { type: 'string' },
            required: true,
            description: 'The ID of the event',
          },
          {
            in: 'path',
            name: 'groupId',
            schema: { type: 'string' },
            required: true,
            description: 'The ID of the group to kick',
          },
        ],
        responses: {
          '204': {
            description: 'The musician has been kicked from the group',
            content: { 'application/json': { schema: { type: 'string' } } },
          },
          '403': {
            description: 'The user does not have the right',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
          '404': {
            description: 'The musician is not in the group',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
        },
      },
    },
    '/genres': {
      get: {
        operationId: 'getGenres',
        description: 'Get a list of all genres',
        tags: ['genres'],
        responses: {
          '200': {
            description: 'A list of all genres',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/genre' },
                },
              },
            },
          },
        },
      },
    },
    '/groups/{groupId}/admins/transfer/{musicianId}': {
      post: {
        operationId: 'transferGroupAdmin',
        tags: ['groups'],
        security: [{ BearerAuth: [] }],
        description: 'Transfer the admin membership to another member',
        parameters: [
          {
            in: 'path',
            name: 'groupId',
            schema: { type: 'string' },
            required: true,
            description: 'The ID of the group',
          },
          {
            in: 'path',
            name: 'musicianId',
            schema: { type: 'string' },
            required: true,
            description: 'The ID of the musician that will become the admin',
          },
        ],
        responses: {
          '204': {
            description: 'The admin membership has been transfered',
            content: { 'application/json': { schema: { type: 'string' } } },
          },
          '403': {
            description: 'The user does not have the right',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
          '404': {
            description: 'The musician is not a member of the group',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
        },
      },
    },
    '/groups/{groupId}/admins/lite_admins/{musicianId}': {
      post: {
        operationId: 'addGroupLiteAdmin',
        tags: ['groups'],
        security: [{ BearerAuth: [] }],
        description: 'Give a group member the lite_admin membership',
        parameters: [
          {
            in: 'path',
            name: 'groupId',
            schema: { type: 'string' },
            required: true,
            description: 'The ID of the group',
          },
          {
            in: 'path',
            name: 'musicianId',
            schema: { type: 'string' },
            required: true,
            description:
              'The ID of the musician that receive lite_admin membership',
          },
        ],
        responses: {
          '204': {
            description: 'The musician became a lite_admin',
            content: { 'application/json': { schema: { type: 'string' } } },
          },
          '403': {
            description: 'The user does not have the right',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
          '404': {
            description: 'The musician is not a member of the group',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
        },
      },
      delete: {
        operationId: 'removeGroupLiteAdmin',
        tags: ['groups'],
        security: [{ BearerAuth: [] }],
        description: 'Remove a group member the lite_admin membership',
        parameters: [
          {
            in: 'path',
            name: 'groupId',
            schema: { type: 'string' },
            required: true,
            description: 'The ID of the group',
          },
          {
            in: 'path',
            name: 'musicianId',
            schema: { type: 'string' },
            required: true,
            description:
              'The ID of the musician that receive lite_admin membership',
          },
        ],
        responses: {
          '204': {
            description:
              'The lite_admin membership has been removed from the group member',
            content: { 'application/json': { schema: { type: 'string' } } },
          },
          '403': {
            description: 'The user does not have the right',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
          '404': {
            description: 'The musician is not a lite_admin of the group',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
        },
      },
    },
    '/groups/{groupId}/admins/lite_admins': {
      put: {
        operationId: 'addGroupLiteAdmins',
        tags: ['groups'],
        security: [{ BearerAuth: [] }],
        description: 'Give a group member the lite_admin membership',
        parameters: [
          {
            in: 'path',
            name: 'groupId',
            schema: { type: 'string' },
            required: true,
            description: 'The ID of the group',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                required: ['lite_admins'],
                type: 'object',
                properties: {
                  lite_admins: {
                    type: 'array',
                    items: {
                      type: 'string',
                      description: 'The ID of the musician',
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          '204': {
            description: 'The musician became a lite_admin',
            content: { 'application/json': { schema: { type: 'string' } } },
          },
          '403': {
            description: 'The user does not have the right',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
          '404': {
            description: 'The musician is not a member of the group',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
        },
      },
    },
    '/groups/event/join': {
      post: {
        operationId: 'groupJoinEvent',
        description: 'A group joins an event',
        security: [{ BearerAuth: [] }],
        tags: ['groups'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  groupId: { type: 'string' },
                  eventId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'The group has joined the event',
            content: { 'application/json': { schema: { type: 'string' } } },
          },
          '404': {
            description: 'The group or event does not exist',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
        },
      },
    },
    '/groups/{groupId}': {
      get: {
        operationId: 'getGroupsById',
        tags: ['groups'],
        security: [{ BearerAuth: [] }],
        description: "Get a group information by it's Id",
        parameters: [
          {
            in: 'path',
            name: 'groupId',
            schema: { type: 'string' },
            required: true,
            description: 'The ID of the group',
          },
        ],
        responses: {
          '200': {
            description: 'The group information',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/group' },
              },
            },
          },
          '404': {
            description: 'The group does not exist',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
        },
      },
      patch: {
        operationId: 'patchGroupsById',
        description: "Patch a group by it's Id",
        security: [{ BearerAuth: [] }],
        tags: ['groups'],
        parameters: [
          {
            in: 'path',
            name: 'groupId',
            schema: { type: 'string' },
            required: true,
            description: 'The ID of the group',
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
                  location: { type: 'string', enum: ['Douai', 'Lille'] },
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
          '200': {
            description: 'The group has been deleted',
            content: { 'application/json': { schema: { type: 'string' } } },
          },
          '403': {
            description: 'The user does not have the right',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
          '404': {
            description: 'The group does not exist',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
        },
      },
      delete: {
        operationId: 'deleteGroupsById',
        description: "Delete a group by it's Id",
        security: [{ BearerAuth: [] }],
        tags: ['groups'],
        parameters: [
          {
            in: 'path',
            name: 'groupId',
            schema: { type: 'string' },
            required: true,
            description: 'The ID of the group',
          },
        ],
        responses: {
          '200': {
            description: 'The group has been deleted',
            content: { 'application/json': { schema: { type: 'string' } } },
          },
          '403': {
            description: 'The user does not have the right',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
          '404': {
            description: 'The group does not exist',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
        },
      },
    },
    '/groups': {
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
            schema: { type: 'string', example: 'Periphery' },
            description: 'The query filter for the group name',
          },
          {
            in: 'query',
            required: false,
            name: 'location',
            schema: {
              type: 'array',
              items: { type: 'string' },
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
              items: { type: 'string' },
              example: ['rock', 'jazz'],
            },
            description: 'The query filter for group genre',
          },
          {
            in: 'query',
            name: 'start',
            required: false,
            schema: { type: 'number', example: 0 },
            description: 'The start index of the query',
          },
          {
            in: 'query',
            name: 'limit',
            required: false,
            schema: { type: 'number', example: 20 },
            description: 'The number of groups returned',
          },
        ],
        responses: {
          '200': {
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
                    _links: { $ref: '#/components/schemas/_links' },
                    results: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/group' },
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
                  group: { $ref: '#/components/schemas/groupDescription' },
                  instruments: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/instrument' },
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
          '201': {
            description: 'The group has been created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/group' },
              },
            },
          },
          '409': {
            description: 'The group already exist',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
        },
      },
    },
    '/groups/invitation/response': {
      post: {
        operationId: 'responseGroupInvitation',
        tags: ['groups'],
        description: 'Respond to a group invitation',
        security: [{ BearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['groupId', 'response'],
                properties: {
                  groupId: { type: 'string' },
                  response: { type: 'string', enum: ['declined', 'member'] },
                },
                example: {
                  groupId: '0bc1164f-c92b-48f3-aadf-a2be610819d8',
                  response: 'member',
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'The user membershhip has been updated',
            content: { 'application/json': { schema: { type: 'string' } } },
          },
          '400': {
            description: 'The user has already responded',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
          '401': {
            description: "User can't respond to this invitation",
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
        },
      },
    },
    '/groups/invitation/send': {
      post: {
        operationId: 'sendGroupInvitation',
        tags: ['groups'],
        description: 'Invite a musician in a group',
        security: [{ BearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['groupId', 'musicianId', 'instrumentId', 'role'],
                properties: {
                  groupId: { type: 'string' },
                  musicianId: { type: 'string' },
                  instrumentId: { type: 'string' },
                  role: { type: 'string', enum: ['lite_admin', 'member'] },
                },
              },
              example: {
                groupId: '0bc1164f-c92b-48f3-aadf-a2be610819d8',
                musicianId: '8c9a685a-2be9-4cf0-a03c-0b316fc4b515',
                instrumentId: 'cd836a31-1663-4a11-8a88-0a249aa70793',
                role: 'member',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'The user has been invited',
            content: { 'application/json': { schema: { type: 'string' } } },
          },
          '400': {
            description: 'The user is already invited',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
          '401': {
            description: "User that invite doesn't have the access",
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
        },
      },
    },
    '/groups/{groupId}/kick/{musicianId}': {
      delete: {
        operationId: 'groupKickMusician',
        tags: ['groups'],
        security: [{ BearerAuth: [] }],
        description: 'Kick a member from a group',
        parameters: [
          {
            in: 'path',
            name: 'groupId',
            required: true,
            schema: { type: 'string' },
            description: 'the Id of the group',
          },
          {
            in: 'path',
            name: 'musicianId',
            required: true,
            schema: { type: 'string' },
            description: 'the Id of the musician to kick',
          },
        ],
        responses: {
          '204': {
            description: 'The musician has been kicked from the group',
            content: { 'application/json': { schema: { type: 'string' } } },
          },
          '403': {
            description: 'The user does not have the right',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
          '404': {
            description: 'The musician is not in the group',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
        },
      },
    },
    '/info': {
      get: {
        operationId: 'getApplicationInfo',
        tags: ['information'],
        description: 'Return the basic information of the app',
        responses: {
          '200': {
            description: 'The basic information about the app',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    nbMusician: { type: 'number' },
                    nbGroups: { type: 'number' },
                    nbEvents: { type: 'number' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/instruments': {
      get: {
        operationId: 'getInstruments',
        tags: ['instruments'],
        responses: {
          '200': {
            description: 'A list of all the instruments',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/instrument' },
                },
              },
            },
          },
        },
      },
    },
    '/musicians/{musicianId}/groups/{groupId}/membership': {
      get: {
        operationId: 'getMusicianGroupMembership',
        description: 'Get the membership of a musician in a group',
        security: [{ BearerAuth: [] }],
        tags: ['musician'],
        parameters: [
          {
            in: 'path',
            name: 'musicianId',
            schema: { type: 'string' },
            required: true,
            description: 'The ID of the muscician',
          },
          {
            in: 'path',
            name: 'groupId',
            schema: { type: 'string' },
            required: true,
            description: 'The ID of the group',
          },
        ],
        responses: {
          '200': {
            description: 'The membership of the musician',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['membership'],
                  properties: { membership: { type: 'string' } },
                },
              },
            },
          },
          '404': {
            description: 'The group or musician does not exist',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
        },
      },
    },
    '/musicians/{musicianId}': {
      get: {
        operationId: 'getMusicianById',
        description: "Get a musician information by it's ID",
        tags: ['musician'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'musicianId',
            schema: { type: 'string' },
            required: true,
            description: 'The ID of the muscician',
          },
        ],
        responses: {
          '200': {
            description: 'The group information',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  allOf: [
                    { $ref: '#/components/schemas/musician' },
                    {
                      type: 'object',
                      required: ['groups'],
                      properties: {
                        groups: {
                          type: 'array',
                          items: {
                            $ref: '#/components/schemas/groupDescription',
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          '404': {
            description: 'The group does not exist',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
        },
      },
    },
    '/musicians': {
      get: {
        operationId: 'getMusicians',
        tags: ['musician'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'name',
            required: false,
            schema: { type: 'string', example: 'Romain' },
            description: 'The query filter for name',
          },
          {
            in: 'query',
            name: 'genres',
            required: false,
            schema: {
              type: 'array',
              items: { type: 'string' },
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
              items: { type: 'string' },
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
              items: { type: 'string' },
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
              items: { type: 'string' },
              example: ['M1'],
            },
            description: 'The query filter for promotion',
          },
          {
            in: 'query',
            name: 'start',
            required: false,
            schema: { type: 'number', example: 0 },
            description: 'The start index of the query',
          },
          {
            in: 'query',
            name: 'limit',
            required: false,
            schema: { type: 'number', example: 20 },
            description: 'The number of musicians returned',
          },
        ],
        responses: {
          '200': {
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
                    _links: { $ref: '#/components/schemas/_links' },
                    results: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/musician' },
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
    },
    '/profil': {
      get: {
        description: 'Get the user connected profil',
        operationId: 'getProfil',
        tags: ['profil'],
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'The user profil information',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  allOf: [
                    { $ref: '#/components/schemas/musician' },
                    {
                      type: 'object',
                      required: ['groups'],
                      properties: {
                        groups: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              instruments: {
                                type: 'array',
                                items: {
                                  $ref: '#/components/schemas/instrument',
                                },
                              },
                              membership: {
                                type: 'string',
                                enum: [
                                  'admin',
                                  'member',
                                  'declined',
                                  'pending',
                                  'lite_admin',
                                ],
                              },
                              group: {
                                $ref: '#/components/schemas/groupDescription',
                              },
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
      patch: {
        operationId: 'patchProfil',
        tags: ['profil'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  givenName: { type: 'string' },
                  familyName: { type: 'string' },
                  phone: { type: 'string' },
                  facebook_url: { type: 'string' },
                  twitter_url: { type: 'string' },
                  instagram_url: { type: 'string' },
                  promotion: {
                    type: 'string',
                    enum: ['L1', 'L2', 'L3', 'M1', 'M2'],
                  },
                  location: { type: 'string', enum: ['Douai', 'Lille'] },
                  genres: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/genre' },
                  },
                  instruments: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/instrument' },
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'The musician information has been updated',
            content: { 'application/json': { schema: { type: 'string' } } },
          },
        },
      },
      delete: {
        operationId: 'deleteProfil',
        tags: ['profil'],
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'The musician information has been updated',
            content: { 'application/json': { schema: { type: 'string' } } },
          },
        },
      },
    },
    '/profil/groups/{groupId}/leave': {
      post: {
        description: 'Leave a group',
        operationId: 'leaveGroup',
        tags: ['profil'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'groupId',
            schema: { type: 'string' },
            required: true,
            description: 'The id of the group to leave',
          },
        ],
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  musicianId: {
                    type: 'string',
                    description:
                      "The id of the musician that will become the new admin of the group, only if it's the admin that is leaving the group",
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'The user have leaved the group',
            content: { 'application/json': { schema: { type: 'string' } } },
          },
          '400': {
            description: 'The body is required for an admin leaving an event',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
          '404': {
            description: 'This user is not in this group',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/httpError' },
              },
            },
          },
        },
      },
    },
  },
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'findAMusician',
    description: 'The API for the website findAMusician',
    contact: {
      name: 'Romain Guarinoni',
      email: 'romain.guar01@gmail.com',
      url: 'https://github.com/RomainGuarinoni',
    },
  },
  servers: [{ url: 'http://localhost:8000', description: 'Local server' }],
  security: [],
  components: {
    schemas: {
      musician: {
        type: 'object',
        required: [
          'email',
          'id',
          'givenName',
          'familyName',
          'promotion',
          'location',
          'instruments',
          'genres',
        ],
        properties: {
          id: { type: 'string' },
          email: { type: 'string', format: 'email' },
          givenName: { type: 'string' },
          familyName: { type: 'string' },
          description: { type: 'string', nullable: true },
          phone: { type: 'string', nullable: true },
          facebook_url: { type: 'string', nullable: true },
          twitter_url: { type: 'string', nullable: true },
          instagram_url: { type: 'string', nullable: true },
          isLookingForGroups: { type: 'boolean' },
          promotion: { type: 'string', enum: ['L1', 'L2', 'L3', 'M1', 'M2'] },
          location: { type: 'string', enum: ['Douai', 'Lille'] },
          instruments: {
            type: 'array',
            items: { $ref: '#/components/schemas/instrument' },
          },
          genres: {
            type: 'array',
            items: { $ref: '#/components/schemas/genre' },
          },
        },
      },
      musicianMinimized: {
        type: 'object',
        required: [
          'email',
          'id',
          'givenName',
          'familyName',
          'promotion',
          'location',
        ],
        properties: {
          id: { type: 'string' },
          email: { type: 'string', format: 'email' },
          givenName: { type: 'string' },
          familyName: { type: 'string' },
          phone: { type: 'string', nullable: true },
          facebook_url: { type: 'string', nullable: true },
          twitter_url: { type: 'string', nullable: true },
          instagram_url: { type: 'string', nullable: true },
          promotion: { type: 'string', enum: ['L1', 'L2', 'L3', 'M1', 'M2'] },
          location: { type: 'string', enum: ['Douai', 'Lille'] },
        },
      },
      group: {
        type: 'object',
        required: [
          'name',
          'description',
          'location',
          'genres',
          'id',
          'members',
        ],
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          location: { type: 'string', enum: ['Douai', 'Lille'] },
          genres: {
            type: 'array',
            items: { $ref: '#/components/schemas/genre' },
          },
          members: {
            type: 'array',
            items: { $ref: '#/components/schemas/groupMember' },
          },
        },
      },
      groupDescription: {
        type: 'object',
        required: ['name', 'description', 'location', 'genres'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          location: { type: 'string', enum: ['Douai', 'Lille'] },
          genres: {
            type: 'array',
            items: { $ref: '#/components/schemas/genre' },
          },
        },
      },
      groupMember: {
        type: 'object',
        properties: {
          musician: { $ref: '#/components/schemas/musicianMinimized' },
          instruments: {
            type: 'array',
            items: { $ref: '#/components/schemas/instrument' },
          },
          membership: {
            type: 'string',
            enum: ['admin', 'member', 'declined', 'pending', 'lite_admin'],
          },
        },
      },
      instrument: {
        type: 'object',
        required: ['name', 'id'],
        properties: { id: { type: 'string' }, name: { type: 'string' } },
      },
      genre: {
        type: 'object',
        required: ['id', 'name'],
        properties: { id: { type: 'string' }, name: { type: 'string' } },
      },
      event: {
        type: 'object',
        required: [
          'name',
          'description',
          'startDate',
          'endDate',
          'adress',
          'genres',
          'groups',
          'admins',
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
          groups: {
            type: 'array',
            items: { $ref: '#/components/schemas/groupDescription' },
          },
          admins: {
            type: 'array',
            items: { $ref: '#/components/schemas/musicianMinimized' },
          },
        },
      },
      token: {
        type: 'object',
        required: ['accessToken', 'refreshToken'],
        properties: {
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
        },
      },
      httpError: {
        type: 'object',
        required: ['msg'],
        properties: { msg: { type: 'string' }, stack: { type: 'string' } },
      },
      _links: {
        type: 'object',
        required: ['self', 'first'],
        properties: {
          self: { type: 'string' },
          first: { type: 'string' },
          previous: { type: 'string' },
          next: { type: 'string' },
        },
      },
    },
    securitySchemes: {
      BearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
  },
  tags: [
    { name: 'genres', description: 'Everything related to the genre music' },
    { name: 'groups', description: 'Everything related to the music groups' },
    { name: 'auth', description: 'Everything related to the authentification' },
    { name: 'musician', description: 'Everything related to the musicians' },
    {
      name: 'profil',
      description: 'Everything related to the current logged user profil',
    },
    { name: 'test', description: 'Route for test' },
    { name: 'events', description: 'Everything related to the events' },
    {
      name: 'instruments',
      description: 'Everything related to the instruments',
    },
  ],
};
export default openApiDocs;
