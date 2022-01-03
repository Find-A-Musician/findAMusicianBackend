import app from '../../server/server';
import request from 'supertest';
import pg from '../../postgres';
import bcrypt from 'bcrypt';

jest.mock('bcrypt');

jest.mock('../../postgres');

describe('/login', () => {
  const compare = bcrypt.compare as jest.Mock;
  const query = pg.query as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // vérifier qu'il y a bienn les cookies
  it('Login the user', async () => {
    const body = {
      email: 'test@gmail.com',
      password: 'password',
    };

    query.mockReturnValueOnce({ rows: [{ id: 'id', password: 'hash' }] });

    compare.mockImplementationOnce(
      (): Promise<boolean> => Promise.resolve(true),
    );

    query.mockReturnValueOnce({});

    query.mockReturnValueOnce({
      rows: [
        {
          id: 'id',
          email: 'test@gmail.com',
          givenName: '',
          familyName: '',
          phone: '',
          facebook_url: null,
          twitter_url: null,
          instagram_url: null,
          promotion: 'L1',
          location: 'Douai',
        },
      ],
    });

    query.mockReturnValueOnce({ rows: [{ id: 'id', name: 'genres' }] });
    query.mockReturnValueOnce({ rows: [{ id: 'id', name: 'instrument' }] });

    await request(app)
      .post('/login')
      .send(body)
      .expect(200)
      .then(({ body }) => {
        expect(Boolean(body.token.accessToken)).toStrictEqual(true);
        expect(Boolean(body.token.refreshToken)).toStrictEqual(true);
        expect(Boolean(body.musician.id)).toStrictEqual(true);
      });
  });

  it('Wrong password', async () => {
    const body = {
      email: 'romain.guar01@gmail.com',
      password: 'romain123',
    };

    query.mockReturnValueOnce({
      rows: [{ id: 'id', password: 'hash', email: 'test@gmail.com' }],
    });

    compare.mockImplementationOnce(
      (): Promise<boolean> => Promise.resolve(false),
    );

    await request(app)
      .post('/login')
      .send(body)
      .expect(401)
      .then(({ body: { msg } }) => {
        expect(msg).toStrictEqual('E_INVALID_PASSWORD');
      });
  });

  it('Wrong password', async () => {
    const body = {
      email: 'romain.guar01@gmail.com',
      password: 'romain123',
    };

    query.mockReturnValueOnce({
      rows: [{ id: 'id', password: 'hash', email: 'test@gmail.com' }],
    });

    compare.mockImplementationOnce(
      (): Promise<boolean> => Promise.resolve(false),
    );

    await request(app)
      .post('/login')
      .send(body)
      .expect(401)
      .then(({ body: { msg } }) => {
        expect(msg).toStrictEqual('E_INVALID_PASSWORD');
      });
  });

  it("user doesn't exist", async () => {
    const body = {
      email: 'romain.guar01@gmail.com',
      password: 'romain123',
    };

    query.mockReturnValueOnce({
      rows: [],
    });

    await request(app)
      .post('/login')
      .send(body)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toStrictEqual('E_UNFOUND_USER');
      });
  });

  it('Failed to compare', async () => {
    const body = {
      email: 'romain.guar01@gmail.com',
      password: 'romain123',
    };

    query.mockReturnValueOnce({
      rows: [{ id: 'id', password: 'hash', email: 'test@gmail.com' }],
    });

    compare.mockImplementationOnce(() => {
      throw new Error();
    });

    await request(app)
      .post('/login')
      .send(body)
      .expect(500)
      .then(({ body: { msg } }) => {
        expect(msg).toStrictEqual('E_COMPARE_FAILED');
      });
  });
});
