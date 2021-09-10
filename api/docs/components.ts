import {Component} from '@typing';

const components:Component = {
  components: {
    schemas: {
      musician: {
        type: 'object',
        required: ['email', 'givenName', 'familyName', 'promotion', 'location'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
          },
          givenName: {type: 'string'},
          familyName: {type: 'string'},
          phone: {type: 'string'},
          facebookUrl: {type: 'string'},
          twitterUrl: {type: 'string'},
          instagramUrl: {type: 'string'},
          promotion: {type: 'string', enum: ['L1', 'L2', 'L3', 'M1', 'M2']},
          location: {type: 'string', enum: ['Douai', 'Lille']},
        },
      },
      token: {
        type: 'object',
        required: ['token', 'refresh_token'],
        properties: {
          token: {type: 'string'},
          refresh_token: {type: 'string'},
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
