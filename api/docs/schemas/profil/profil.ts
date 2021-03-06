import { HandlerDefinition } from '@typing';

const schema: HandlerDefinition = {
  path: '/profil',
  get: {
    description: 'Get the user connected profil',
    operationId: 'getProfil',
    tags: ['profil'],
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
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
                            items: { $ref: '#/components/schemas/instrument' },
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
                items: {
                  $ref: '#/components/schemas/genre',
                },
              },
              instruments: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/instrument',
                },
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'The musician information has been updated',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
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
      200: {
        description: 'The musician information has been updated',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};

export default schema;
