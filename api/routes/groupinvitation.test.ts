import queryMock from '../postgres';
import app from '../server/server';
import request from 'supertest';
import generateToken, { GrantTypes } from '../auth/generateToken';

jest.mock('../postgres');

describe('/groupinvitation', () => {
  const query = queryMock as jest.Mock;

  const body = {
    groupId: '0bc1164f-c92b-48f3-aadf-a2be610819d8',
    musicianId: '8c9a685a-2be9-4cf0-a03c-0b316fc4b515',
    instrumentId: 'cd836a31-1663-4a11-8a88-0a249aa70793',
    role: 'member',
  };

  const token = `Bearer ${generateToken(
    GrantTypes.AuthorizationCode,
    '8f6c1dd5-7444-46c9-b673-840731bfd041',
  )}`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('send an invitation', async () => {
    query.mockReturnValueOnce({
      rows: [],
    });

    query.mockReturnValueOnce({
      rows: [{ role: 'admin' }],
    });

    query.mockReturnValueOnce({
      rows: [],
    });

    await request(app)
      .post('/groups/invitation/send')
      .set('Authorization', token)
      .send(body)
      .expect(201)
      .then(({ body }) => {
        expect(body).toStrictEqual('The user has been invited');
      });
  });

  it('The user is already invited', async () => {
    query.mockReturnValueOnce({
      rows: [
        {
          group: '0bc1164f-c92b-48f3-aadf-a2be610819d8',
          musician: '8f6c1dd5-7444-46c9-b673-840731bfd041',
          instrument: 'cd836a31-1663-4a11-8a88-0a249aa70793',
          membership: 'member',
          role: 'admin',
        },
      ],
    });

    await request(app)
      .post('/groups/invitation/send')
      .set('Authorization', token)
      .send(body)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toStrictEqual('E_ALREADY_INVITED');
      });
  });

  it('The invitor is a member', async () => {
    query.mockReturnValueOnce({ rows: [] });

    query.mockReturnValueOnce({
      rows: [
        {
          role: 'member',
        },
      ],
    });

    await request(app)
      .post('/groups/invitation/send')
      .set('Authorization', token)
      .send(body)
      .expect(401)
      .then(({ body: { msg } }) => {
        expect(msg).toStrictEqual('E_UNAUTHORIZE_INVITOR');
      });
  });

  it('The inviror is not in the', async () => {
    query.mockReturnValueOnce({ rows: [] });

    query.mockReturnValueOnce({ rows: [] });

    await request(app)
      .post('/groups/invitation/send')
      .set('Authorization', token)
      .send(body)
      .expect(401)
      .then(({ body: { msg } }) => {
        expect(msg).toStrictEqual('E_UNAUTHORIZE_INVITOR');
      });
  });

  it('User respond to the invitation', async () => {
    query.mockReturnValueOnce({
      rows: [
        {
          membership: 'pending',
        },
      ],
    });

    query.mockReturnValueOnce({});

    const body = {
      groupId: '0bc1164f-c92b-48f3-aadf-a2be610819d8',
      response: 'member',
    };

    await request(app)
      .post('/groups/invitation/response')
      .set('Authorization', token)
      .send(body)
      .expect(201)
      .then(({ body }) => {
        expect(body).toStrictEqual('The user membership has been updated');
      });
  });

  it("User can't respond to the invitation", async () => {
    query.mockReturnValueOnce({
      rows: [],
    });

    const body = {
      groupId: '0bc1164f-c92b-48f3-aadf-a2be610819d8',
      response: 'member',
    };

    await request(app)
      .post('/groups/invitation/response')
      .set('Authorization', token)
      .send(body)
      .expect(401)
      .then(({ body: { msg } }) => {
        expect(msg).toStrictEqual("User can't respond to this invitation");
      });
  });

  it('User has already respond to the invitation', async () => {
    query.mockReturnValueOnce({
      rows: [
        {
          membership: 'member',
        },
      ],
    });

    const body = {
      groupId: '0bc1164f-c92b-48f3-aadf-a2be610819d8',
      response: 'member',
    };

    await request(app)
      .post('/groups/invitation/response')
      .set('Authorization', token)
      .send(body)
      .expect(401)
      .then(({ body: { msg } }) => {
        expect(msg).toStrictEqual('The user has already responded');
      });
  });
});
