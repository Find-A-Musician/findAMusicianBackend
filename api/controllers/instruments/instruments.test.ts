import app from '../../server/server';
import request from 'supertest';
import pg from '../../postgres';

jest.mock('../../postgres');

describe('/instruments', () => {
  const query = pg.query as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Return all the instruments', async () => {
    query.mockReturnValueOnce({
      rows: [
        {
          id: 'id',
          name: 'drums',
        },
      ],
    });

    await request(app)
      .get('/instruments')
      .expect(200)
      .then(({ body }) => {
        expect(body).toStrictEqual([
          {
            id: 'id',
            name: 'drums',
          },
        ]);
      });
  });
});
