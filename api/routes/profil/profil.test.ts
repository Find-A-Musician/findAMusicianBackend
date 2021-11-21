import app from '../../server/server';
import request from 'supertest';
import pg from '../../postgres';
import generateToken, { GrantTypes } from '../../auth/generateToken';

jest.mock('../../postgres');

describe('/profil', () => {
  const query = pg.query as jest.Mock;

  const token = `Bearer ${generateToken(
    GrantTypes.AuthorizationCode,
    '8f6c1dd5-7444-46c9-b673-840731bfd041',
  )}`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Return the user profil', async () => {
    query.mockReturnValueOnce({
      rows: [
        {
          id: 'id',
          email: 'test@gmail.com',
        },
      ],
    });

    query.mockReturnValueOnce({
      rows: [
        {
          id: 'id',
          name: 'Batterie',
        },
      ],
    });

    query.mockReturnValueOnce({
      rows: [
        {
          id: 'id',
          name: 'metal',
        },
      ],
    });

    await request(app)
      .get('/profil')
      .set('Authorization', token)
      .expect(200)
      .then(({ body }) => {
        expect(body.musician.email).toStrictEqual('test@gmail.com');
        expect(body.instruments[0].name).toStrictEqual('Batterie');
        expect(body.genres[0].name).toStrictEqual('metal');
      });
  });
});
