import pg from '../../postgres';
import app from '../../server/server';
import request from 'supertest';
import generateToken, { GrantTypes } from '../../auth/generateToken';

jest.mock('../../postgres');

describe('/test', () => {
  const query = pg.query as jest.Mock;

  const token = `Bearer ${generateToken(
    GrantTypes.AuthorizationCode,
    '8f6c1dd5-7444-46c9-b673-840731bfd041',
  )}`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('return the app information', async () => {
    query.mockReturnValueOnce({ rows: [{ count: 5 }] });
    query.mockReturnValueOnce({ rows: [{ count: 4 }] });
    query.mockReturnValueOnce({ rows: [{ count: 2 }] });

    await request(app)
      .get('/info')
      .set('Authorization', token)
      .expect(200)
      .then(({ body: { nbMusician, nbEvents, nbGroups } }) => {
        expect(nbMusician).toStrictEqual(5);
        expect(nbGroups).toStrictEqual(4);
        expect(nbEvents).toStrictEqual(2);
      });
  });
});
