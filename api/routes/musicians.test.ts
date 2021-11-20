import app from '../server/server';
import request from 'supertest';
import pg from '../postgres';
import generateToken, { GrantTypes } from '../auth/generateToken';

jest.mock('../postgres');

describe('/musicians', () => {
  const query = pg.query as jest.Mock;

  const token = `Bearer ${generateToken(
    GrantTypes.AuthorizationCode,
    '8f6c1dd5-7444-46c9-b673-840731bfd041',
  )}`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Return all the musicians', async () => {
    query.mockReturnValueOnce({
      rows: [
        {
          id: 'musicianId',
          email: 'test@gmail.com',
        },
      ],
    });

    query.mockReturnValueOnce({
      rows: [
        {
          id: 'instrumentId',
          name: 'batterie',
        },
      ],
    });

    query.mockReturnValueOnce({
      rows: [
        {
          id: 'genreId',
          name: 'metal',
        },
      ],
    });
    query.mockReturnValueOnce({
      rows: [
        {
          id: 'genreId',
        },
      ],
    });

    await request(app)
      .get('/musicians')
      .set('Authorization', token)
      .expect(200)
      .then(({ body }) => {
        expect(body[0]['genres'][0]['id']).toStrictEqual('genreId');
        expect(body[0]['instruments'][0]['id']).toStrictEqual('instrumentId');
      });
  });
});
