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
