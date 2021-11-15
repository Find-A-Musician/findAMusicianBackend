import { Pool } from 'pg';
import app from '../server/server';
import request from 'supertest';
import generateToken, { GrantTypes } from '../auth/generateToken';

describe('/groupinvitation', () => {
  const pg: any = new Pool();

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
    pg.query.mockReturnValueOnce({
      rows: [],
    });

    pg.query.mockReturnValueOnce({
      rows: [{ role: 'admin' }],
    });

    pg.query.mockReturnValueOnce({
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
    pg.query.mockReturnValueOnce({
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
    pg.query.mockReturnValueOnce({ rows: [] });

    pg.query.mockReturnValueOnce({
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
    pg.query.mockReturnValueOnce({ rows: [] });

    pg.query.mockReturnValueOnce({ rows: [] });

    await request(app)
      .post('/groups/invitation/send')
      .set('Authorization', token)
      .send(body)
      .expect(401)
      .then(({ body: { msg } }) => {
        expect(msg).toStrictEqual('E_UNAUTHORIZE_INVITOR');
      });
  });
});
