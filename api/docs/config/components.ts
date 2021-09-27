import { Component } from 'api/types/typing';

const components: Component = {
  components: {
    schemas: {
      musician: {
        type: 'object',
        required: ['email', 'id'],
        properties: {
          id: { type: 'string' },
          email: {
            type: 'string',
            format: 'email',
          },
          givenName: { type: 'string' },
          familyName: { type: 'string' },
          phone: { type: 'string' },
          facebookUrl: { type: 'string' },
          twitterUrl: { type: 'string' },
          instagramUrl: { type: 'string' },
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
        },
      },
      group: {
        type: 'object',
        required: ['name', 'description', 'location'],
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          desription: { type: 'string' },
          location: { type: 'string', enum: ['Douai', 'Lille'] },
          genre: {
            type: 'array',
            items: { $ref: '#/components/schemas/genre' },
          },
        },
      },
      groupMember: {
        type: 'object',
        properties: {
          givenName: { type: 'string' },
          familyName: { type: 'string' },
          instrument: { type: 'string' },
          role: { type: 'string', enum: ['admin', 'member', 'declined'] },
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
    },
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};
export default components;
