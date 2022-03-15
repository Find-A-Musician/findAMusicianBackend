import app from '../../server/server';
import request from 'supertest';
import pg from '../../postgres';
import generateToken, { GrantTypes } from '../../auth/generateToken';

jest.mock('../../postgres');

describe('/groups', () => {
  const query = pg.query as jest.Mock;

  const token = `Bearer ${generateToken(GrantTypes.AuthorizationCode, 'id')}`;

  beforeEach(() => {
    jest.clearAllMocks();
  });
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
  it('Return all the groups', async () => {
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
        name: 'drums',
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
        name: 'drums',
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

  it("Return a group information by it's id", async () => {
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
      .get('/groups/id')
      .set('Authorization', token)
      .expect(200);
  });

  it("The group doesn't exist", async () => {
    query.mockReturnValueOnce({
      rows: [],
    });

    await request(app)
      .get('/groups/id')
      .set('Authorization', token)
      .expect(404)
      .then(({ body: { msg } }) =>
        expect(msg).toStrictEqual('E_GROUP_DOES_NOT_EXIST'),
      );
  });

  it("Delete a group by it's id", async () => {
    const token = `Bearer ${generateToken(
      GrantTypes.AuthorizationCode,
      'adminId',
    )}`;

    query.mockReturnValueOnce({
      rows: [
        {
          musician: 'adminId',
          role: 'admin',
        },
      ],
    });

    query.mockReturnValueOnce({});

    await request(app)
      .delete('/groups/id')
      .set('Authorization', token)
      .expect(200);
  });

  it("Can't delete because the group does not exist", async () => {
    const token = `Bearer ${generateToken(
      GrantTypes.AuthorizationCode,
      'adminId',
    )}`;

    query.mockReturnValueOnce({
      rows: [],
    });

    await request(app)
      .delete('/groups/id')
      .set('Authorization', token)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toStrictEqual('E_GROUP_DOES_NOT_EXIST');
      });
  });

  it("Can't delete because the user is not admin", async () => {
    const token = `Bearer ${generateToken(
      GrantTypes.AuthorizationCode,
      'adminId',
    )}`;

    query.mockReturnValueOnce({
      rows: [
        {
          musician: 'adminId',
          role: 'lite_admin',
        },
      ],
    });

    await request(app)
      .delete('/groups/id')
      .set('Authorization', token)
      .expect(403)
      .then(({ body: { msg } }) => {
        expect(msg).toStrictEqual('E_UNAUTHORIZED_USER');
      });
  });

  it("Patch a group by it's id", async () => {
    const token = `Bearer ${generateToken(
      GrantTypes.AuthorizationCode,
      'adminId',
    )}`;

    const body = {
      id: '0bc1164f-c92b-48f3-aadf-a2be610819d8',
      name: 'hot consuption',
      description: 'a test group ',
      location: 'Douai',
      genre: [
        {
          id: 'string',
          name: 'string',
        },
        {
          id: 'string',
          name: 'string',
        },
      ],
    };

    query.mockReturnValueOnce({
      rows: [
        {
          musician: 'adminId',
          role: 'lite_admin',
        },
      ],
    });

    query.mockReturnValueOnce({});
    query.mockReturnValueOnce({});
    query.mockReturnValueOnce({});
    query.mockReturnValueOnce({});

    await request(app)
      .patch('/groups/id')
      .set('Authorization', token)
      .send(body)
      .expect(200)
      .then(() => {
        expect(query).toBeCalledTimes(5);
      });
  });

  it("Can't update because group does not exist", async () => {
    const token = `Bearer ${generateToken(
      GrantTypes.AuthorizationCode,
      'adminId',
    )}`;

    const body = {
      id: '0bc1164f-c92b-48f3-aadf-a2be610819d8',
      name: 'hot consuption',
      description: 'a test group ',
      location: 'Douai',
      genre: [
        {
          id: 'string',
          name: 'string',
        },
        {
          id: 'string',
          name: 'string',
        },
      ],
    };

    query.mockReturnValueOnce({
      rows: [],
    });

    await request(app)
      .patch('/groups/id')
      .set('Authorization', token)
      .send(body)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toStrictEqual('E_GROUP_DOES_NOT_EXIST');
      });
  });

  it("Can't update because user is member", async () => {
    const token = `Bearer ${generateToken(
      GrantTypes.AuthorizationCode,
      'adminId',
    )}`;

    const body = {
      id: '0bc1164f-c92b-48f3-aadf-a2be610819d8',
      name: 'hot consuption',
      description: 'a test group ',
      location: 'Douai',
      genre: [
        {
          id: 'string',
          name: 'string',
        },
        {
          id: 'string',
          name: 'string',
        },
      ],
    };

    query.mockReturnValueOnce({
      rows: [
        {
          musician: 'adminId',
          role: 'member',
        },
      ],
    });

    await request(app)
      .patch('/groups/id')
      .set('Authorization', token)
      .send(body)
      .expect(403)
      .then(({ body: { msg } }) => {
        expect(msg).toStrictEqual('E_UNAUTHORIZED_USER');
      });
  });
});
