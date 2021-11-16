import { Pool } from 'pg';
import request from 'supertest';
import app from '../server/server';
import generateToken, { GrantTypes } from '../auth/generateToken';

describe('/genres', () => {
  const pg: any = new Pool();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Return the genres list', async () => {
    pg.query.mockReturnValueOnce({
      rows: [
        {
          id: 'id',
          name: 'name',
        },
      ],
    });

    await request(app)
      .get('/genres')
      .set(
        'Authorization',
        `Bearer ${generateToken(
          GrantTypes.AuthorizationCode,
          '8f6c1dd5-7444-46c9-b673-840731bfd041',
        )}`,
      )
      .expect(200);

    expect(pg.query).toBeCalledTimes(1);
  });
});
