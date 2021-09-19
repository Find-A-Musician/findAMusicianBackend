import {HandlerDefinition} from 'api/types/typing';

const schema: HandlerDefinition = {
  path: '/musician/{musicianId}',

  patch: {
    operationId: 'patchMusician',
    tags: ['musician'],
    parameters: [{name: 'musicianId', in: 'path'}],
    security: [
      {'BearerAuth': []},
    ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
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
              location: {type: 'string', enum: ['Douai', 'Lille']}},
          },
        },
      },

    },
    responses: {
      201: {
        description: 'The musician information has been updated',
      },
    },
  },
};

export default schema;
