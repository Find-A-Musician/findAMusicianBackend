import { HandlerDefinition } from '../../../types/typing';

const schema: HandlerDefinition = {
  path: '/musicians/{musicianId}',
  get: {
    operationId: 'getMusicianById',
    description: "Get a musician information by it's ID",
    tags: ['musician'],
    security: [{ BearerAuth: [] }],
    parameters: [
      {
        in: 'path',
        name: 'musicianId',
        schema: {
          type: 'string',
        },
        required: true,
        description: 'The ID of the muscician',
      },
    ],
    responses: {
      200: {
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

      404: {
        description: 'The group does not exist',
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
