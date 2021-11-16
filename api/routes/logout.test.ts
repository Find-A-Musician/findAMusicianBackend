import app from '../server/server';
import request from 'supertest';
import { Pool } from 'pg';
import generateToken, { GrantTypes } from '../auth/generateToken';

describe('/logout', () => {
  const pg: any = new Pool();

  const token = `Bearer ${generateToken(
    GrantTypes.AuthorizationCode,
    '8f6c1dd5-7444-46c9-b673-840731bfd041',
  )}`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Logout the user', async () => {
    pg.query.mockReturnValueOnce({ rows: [] });
    await request(app)
      .delete('/logout')
      .set('Authorization', token)
      .expect(200)
      .then(({ body }) =>
        expect(body).toStrictEqual('the user has been logout'),
      );
  });
});
