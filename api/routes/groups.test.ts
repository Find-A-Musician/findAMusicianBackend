import app from '../server/server';
import request from 'supertest';
import queryMock from '../postgres';
import generateToken, { GrantTypes } from '../auth/generateToken';

jest.mock('../postgres');

describe('/groups', () => {
  const query = queryMock as jest.Mock;

  const token = `Bearer ${generateToken(GrantTypes.AuthorizationCode, 'id')}`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Return all the groups', async () => {
    const groupInformation = {
      id: '0bc1164f-c92b-48f3-aadf-a2be610819d8',
      name: 'hot consuption',
      description: 'a test group ',
      location: 'Douai',
    };

    const genre = {
      id: 'id',
      name: 'metal',
    };

    const groupMembers = {
      id: 'id',
      email: 'test@email',
    };

    query.mockReturnValueOnce({
      rows: [groupInformation],
    });

    query.mockReturnValueOnce({
      rows: [genre],
    });

    query.mockReturnValueOnce({
      rows: [groupMembers],
    });

    await request(app)
      .get('/groups')
      .set('Authorization', token)
      .expect(200)
      .then(({ body }) => {
        expect(body).toStrictEqual([
          {
            groupInformation: {
              id: '0bc1164f-c92b-48f3-aadf-a2be610819d8',
              name: 'hot consuption',
              description: 'a test group ',
              location: 'Douai',
              genre: [genre],
            },
            groupMembers: [groupMembers],
          },
        ]);
      });
  });

  it('Create a new group', async () => {
    const body = {
      group: {
        name: 'Red Mustard',
        description: 'the craziest group ever',
        location: 'Lille',
        genre: [
          {
            id: 'd5e352dc-29a6-4a2d-a226-29d6866d1b5d',
            name: 'rock',
          },
        ],
      },
      instrument: {
        id: 'cd836a31-1663-4a11-8a88-0a249aa70793',
        name: 'batterie',
      },
    };

    query.mockReturnValueOnce({});
    query.mockReturnValueOnce({});
    query.mockReturnValueOnce({});

    await request(app)
      .post('/groups')
      .set('Authorization', token)
      .send(body)
      .expect(201);
  });

  it('The group name already exist', async () => {
    const body = {
      group: {
        name: 'Red Mustard',
        description: 'the craziest group ever',
        location: 'Lille',
        genre: [
          {
            id: 'd5e352dc-29a6-4a2d-a226-29d6866d1b5d',
            name: 'rock',
          },
        ],
      },
      instrument: {
        id: 'cd836a31-1663-4a11-8a88-0a249aa70793',
        name: 'batterie',
      },
    };

    query.mockImplementation(() => {
      throw new Error();
    });

    await request(app)
      .post('/groups')
      .set('Authorization', token)
      .send(body)
      .expect(422)
      .then(({ body: { msg } }) => {
        expect(msg).toStrictEqual('E_GROUP_NAME_ALREADY_TAKEN');
      });
  });
});
