import app from '../server/server';
import request from 'supertest';
import { Pool } from 'pg';
import generateToken, { GrantTypes } from '../auth/generateToken';

describe('/instruments', () => {
  const pg: any = new Pool();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Return all the instruments', async () => {
    const token = `Bearer ${generateToken(
      GrantTypes.AuthorizationCode,
      '8f6c1dd5-7444-46c9-b673-840731bfd041',
    )}`;

    pg.query.mockReturnValueOnce({
      rows: [
        {
          id: 'id',
          name: 'batterie',
        },
      ],
    });

    await request(app)
      .get('/instruments')
      .set('Authorization', token)
      .expect(200)
      .then(({ body }) => {
        expect(body).toStrictEqual([
          {
            id: 'id',
            name: 'batterie',
          },
        ]);
      });
  });
});
