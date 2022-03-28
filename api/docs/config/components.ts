import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';

const components: OpenAPIV3.Document['components'] = {
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
        email: {
          type: 'string',
          format: 'email',
        },
        givenName: { type: 'string' },
        familyName: { type: 'string' },
        description: { type: 'string', nullable: true },
        phone: { type: 'string', nullable: true },
        facebook_url: { type: 'string', nullable: true },
        twitter_url: { type: 'string', nullable: true },
        instagram_url: { type: 'string', nullable: true },
        isLookingForGroups: { type: 'boolean' },
        promotion: {
          type: 'string',
          enum: ['L1', 'L2', 'L3', 'M1', 'M2'],
        },
        location: { type: 'string', enum: ['Douai', 'Lille'] },
        instruments: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/instrument',
          },
        },
        genres: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/genre',
          },
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
        email: {
          type: 'string',
          format: 'email',
        },
        givenName: { type: 'string' },
        familyName: { type: 'string' },
        phone: { type: 'string', nullable: true },
        facebook_url: { type: 'string', nullable: true },
        twitter_url: { type: 'string', nullable: true },
        instagram_url: { type: 'string', nullable: true },
        promotion: {
          type: 'string',
          enum: ['L1', 'L2', 'L3', 'M1', 'M2'],
        },
        location: { type: 'string', enum: ['Douai', 'Lille'] },
      },
    },
    group: {
      type: 'object',
      required: ['name', 'description', 'location', 'genres', 'id', 'members'],
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
          enum: ['admin', 'member', 'lite_admin'],
        },
      },
    },
    instrument: {
      type: 'object',
      required: ['name', 'id'],
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
      },
    },
    genre: {
      type: 'object',
      required: ['id', 'name'],
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
      },
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
      properties: {
        msg: { type: 'string' },
        stack: { type: 'string' },
      },
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
    notification: {
      type: 'object',
      required: ['created_at', 'type'],
      properties: {
        type: { type: 'string' },
        created_at: { type: 'string', format: 'date-time' },
        group: { $ref: '#/components/schemas/groupDescription' },
        membership: {
          type: 'string',
          enum: ['admin', 'member', 'declined', 'pending', 'lite_admin'],
        },
      },
    },
    invitation: {
      type: 'object',
      required: ['type', 'id', 'instruments'],
      properties: {
        id: { type: 'string' },
        type: { type: 'string', enum: ['musicianToGroup', 'groupToMusician'] },
        group: { $ref: '#/components/schemas/groupDescription' },
        musician: { $ref: '#/components/schemas/musicianMinimized' },
        invitor: { $ref: '#/components/schemas/musicianMinimized' },
        instruments: {
          type: 'array',
          items: { $ref: '#/components/schemas/instrument' },
        },
        description: { type: 'string' },
      },
    },
  },
  securitySchemes: {
    BearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
};
export default components;
