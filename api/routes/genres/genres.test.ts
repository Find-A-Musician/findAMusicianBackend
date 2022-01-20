import pg from '../../postgres';
import request from 'supertest';
import app from '../../server/server';

jest.mock('../../postgres');

describe('/genres', () => {
  const query = pg.query as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Return the genres list', async () => {
    query.mockReturnValueOnce({
      rows: [
        {
          id: 'id',
          name: 'name',
        },
      ],
    });

    await request(app).get('/genres').expect(200);

    expect(query).toBeCalledTimes(1);
  });
});
