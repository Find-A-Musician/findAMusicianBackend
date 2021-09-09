const components = {
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
    example: {
      musician: {
        email: 'john.doe@gmail.com',
        givenName: 'John',
        familyName: 'Doe',
        phone: '+33766072513',
        facebookUrl: 'https://facebook/id',
        twitterUrl: 'https://twitter/id',
        instagramUrl: 'https://instagram/id',
        promotion: 'L1',
        location: 'Douai',
      },
    },
  },
};
export default components;
