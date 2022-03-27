import { HandlerDefinition } from '../../../../types/typing';

const schema: HandlerDefinition = {
  path: '/musicians/{musicianId}/groups',
  get: {
    operationId: 'getMusicianGroups',
    description: 'Get all the groups a musician belongs to',
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
        description: 'List of groups a musician belongs to',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/group',
              },
            },
          },
        },
      },
      404: {
        description: 'The musician does not exist',
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
