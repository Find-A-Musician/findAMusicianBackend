import app from '../server/server';
import request from 'supertest';
import pg from '../postgres';
import generateToken, { GrantTypes } from '../auth/generateToken';

jest.mock('../postgres');

describe('/logout', () => {
  const query = pg.query as jest.Mock;

  const token = `Bearer ${generateToken(
    GrantTypes.AuthorizationCode,
    '8f6c1dd5-7444-46c9-b673-840731bfd041',
  )}`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Logout the user', async () => {
    query.mockReturnValueOnce({ rows: [] });
    await request(app)
      .delete('/logout')
      .set('Authorization', token)
      .expect(200)
      .then(({ body }) =>
        expect(body).toStrictEqual('the user has been logout'),
      );
  });
});
