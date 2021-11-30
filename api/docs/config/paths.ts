import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';
const paths: OpenAPIV3.Document['paths'] = {
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
              properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string' },
              },
            },
            example: {
              email: 'romain.guar01@gmail.com',
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
        '500': {
          description: 'Error intern server',
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
        '500': {
          description: 'Error intern server',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/httpError' },
            },
          },
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
        '500': {
          description: 'Error intern server',
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
              required: ['musician', 'password', 'genres', 'instruments'],
              properties: {
                musician: { $ref: '#/components/schemas/musician' },
                password: { type: 'string' },
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
            example: {
              musician: {
                id: 'uuid',
                email: 'john.doe@gmail.com',
                givenName: 'John',
                familyName: 'Doe',
                phone: '0760072513',
                facebook_url: 'https://facebook.com',
                twitter_url: 'https://twitter.com',
                instagram_url: 'https://instagram.com',
                promotion: 'L1',
                location: 'Douai',
              },
              password: 'password',
              genres: [
                { id: 'd5e352dc-29a6-4a2d-a226-29d6866d1b5d', name: 'rock' },
                { id: '7d68d33c-3eff-4f5e-985b-c7d9e058e23a', name: 'metal' },
              ],
              instruments: [
                {
                  id: 'cd836a31-1663-4a11-8a88-0a249aa70793',
                  name: 'batterie',
                },
                { id: 'e345114e-7723-42eb-8ed1-f26cd2f9d084', name: 'guitare' },
              ],
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
                required: ['token', 'musician', 'genres', 'instruments'],
                properties: {
                  token: { $ref: '#/components/schemas/token' },
                  musician: { $ref: '#/components/schemas/musician' },
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
        '500': {
          description: 'Error intern server',
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
        '500': {
          description: 'Error intern server',
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
        '500': {
          description: 'Error intern server',
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
              required: [
                'name',
                'description',
                'start_date',
                'end_date',
                'adress',
              ],
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                start_date: { type: 'string', format: 'date-time' },
                end_date: { type: 'string', format: 'date-time' },
                adress: { type: 'string' },
              },
            },
          },
        },
      },
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
        '500': {
          description: 'Error intern server',
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
      security: [{ BearerAuth: [] }],
      responses: {
        '200': {
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
        '500': {
          description: 'Error intern server',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/httpError' },
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
            schema: { $ref: '#/components/schemas/event' },
            example: {
              name: 'Insane event',
              description: 'An insane event',
              start_date: '2021-11-23T10:48:59.647Z',
              end_date: '2021-11-23T10:48:59.647Z',
              adress: 'somewhere',
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'The event has been created',
          content: { 'application/json': { schema: { type: 'string' } } },
        },
        '401': {
          description: 'Event already created',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/httpError' },
            },
          },
        },
        '500': {
          description: 'Error intern server',
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
      security: [{ BearerAuth: [] }],
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
        '500': {
          description: 'Error intern server',
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
              schema: {
                type: 'object',
                required: ['groupInformation', 'groupMembers'],
                properties: {
                  groupInformation: { $ref: '#/components/schemas/group' },
                  groupMembers: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/groupMember' },
                  },
                },
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
        '500': {
          description: 'Error intern server',
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
            schema: { $ref: '#/components/schemas/group' },
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
        '500': {
          description: 'Error intern server',
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
        '500': {
          description: 'Error intern server',
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
        '500': {
          description: 'Error intern server',
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
      responses: {
        '200': {
          description: 'An array of groups',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['groupInformation', 'groupMembers'],
                  properties: {
                    groupInformation: { $ref: '#/components/schemas/group' },
                    groupMembers: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/groupMember' },
                    },
                  },
                },
              },
            },
          },
        },
        '500': {
          description: 'Error intern server',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/httpError' },
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
              required: ['group', 'instrument'],
              properties: {
                group: { $ref: '#/components/schemas/group' },
                genres: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/genre' },
                },
                instrument: { $ref: '#/components/schemas/instrument' },
              },
            },
            example: {
              group: {
                name: 'Red Mustard',
                description: 'the craziest group ever',
                location: 'Lille',
                genre: [
                  { id: 'd5e352dc-29a6-4a2d-a226-29d6866d1b5d', name: 'rock' },
                ],
              },
              instrument: {
                id: 'cd836a31-1663-4a11-8a88-0a249aa70793',
                name: 'batterie',
              },
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'The group has been created',
          content: { 'application/json': { schema: { type: 'string' } } },
        },
        '422': {
          description: 'An error in the request body',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/httpError' },
            },
          },
        },
        '500': {
          description: 'Error intern server',
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
        '500': {
          description: 'Error intern server',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/httpError' },
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
      security: [{ BearerAuth: [] }],
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
        '500': {
          description: 'Error intern server',
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
              schema: { $ref: '#/components/schemas/musician' },
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
        '500': {
          description: 'Error intern server',
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
      responses: {
        '200': {
          description: 'A list of all the musicians informations',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/musician' },
              },
            },
          },
        },
        '500': {
          description: 'Error intern server',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/httpError' },
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
                required: ['musician', 'genres', 'instruments'],
                properties: {
                  musician: { $ref: '#/components/schemas/musician' },
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
        '500': {
          description: 'Error intern server',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/httpError' },
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
        '500': {
          description: 'Error intern server',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/httpError' },
            },
          },
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
        '500': {
          description: 'Error intern server',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/httpError' },
            },
          },
        },
      },
    },
  },
  '/test': {
    get: {
      operationId: 'test',
      tags: ['test'],
      description: 'A simple get route for testing',
      security: [{ BearerAuth: [] }],
      responses: {
        '200': {
          description: 'The test has been a success',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['userId'],
                properties: { userId: { type: 'string' } },
              },
            },
          },
        },
        '401': {
          description: 'Token not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/httpError' },
            },
          },
        },
        '403': {
          description: 'Invalid token',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/httpError' },
            },
          },
        },
        '500': {
          description: 'Error intern server',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/httpError' },
            },
          },
        },
      },
    },
  },
};
export default paths;
