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
      email: 'romain.guar01@gmail.com',
      password: 'romain123',
    };

    query.mockReturnValueOnce({
      rows: [{ id: 'id', password: 'hash', email: 'test@gmail.com' }],
    });

    compare.mockImplementationOnce(
      (): Promise<boolean> => Promise.resolve(true),
    );

    await request(app)
      .post('/login')
      .send(body)
      .expect(200)
      .then(({ body, header }) => {
        expect(Boolean(body['token']['accessToken'])).toBe(true);
        expect(Boolean(body['token']['refreshToken'])).toBe(true);
        expect(Boolean(body['musician'])).toBe(true);
        expect(header['set-cookie'].length).toStrictEqual(2);
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
