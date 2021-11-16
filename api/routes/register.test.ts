import { Pool } from 'pg';
import request from 'supertest';
import app from '../server/server';
import { operations } from '@schema';
import { getRequestBody } from '@typing';
import bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('/register', () => {
  const pg: any = new Pool();
  const hash = bcrypt.hash as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('register a new user', async () => {
    const bodyMusician: getRequestBody<operations['register']> = {
      musician: {
        email: 'test@gmail.com',
        givenName: 'Test',
        familyName: 'test',
        phone: '0655443322',
        facebook_url: 'url',
        promotion: 'M1',
        location: 'Douai',
      },
      genres: [
        {
          id: 'id',
          name: 'genre',
        },
      ],
      password: 'password',
      instruments: [{ id: 'id', name: 'name' }],
    };

    hash.mockImplementationOnce((): Promise<string> => Promise.resolve('hash'));
    pg.query.mockReturnValueOnce();
    pg.query.mockReturnValueOnce();
    pg.query.mockReturnValueOnce();
    pg.query.mockReturnValueOnce();

    await request(app)
      .post('/register')
      .send(bodyMusician)
      .expect(201)
      .then(({ body, header }) => {
        expect(Boolean(body['token']['accessToken'])).toBe(true);
        expect(Boolean(body['token']['refreshToken'])).toBe(true);
        expect(Boolean(body['musician'])).toBe(true);
        expect(header['set-cookie'].length).toStrictEqual(2);
      });

    expect(pg.query).toBeCalledTimes(4);
  });

  it('Failed to hash the password', async () => {
    const bodyMusician: getRequestBody<operations['register']> = {
      musician: {
        email: 'test@gmail.com',
        givenName: 'Test',
        familyName: 'test',
        phone: '0655443322',
        facebook_url: 'url',
        promotion: 'M1',
        location: 'Douai',
      },
      genres: [
        {
          id: 'id',
          name: 'genre',
        },
      ],
      password: 'password',
      instruments: [{ id: 'id', name: 'name' }],
    };

    hash.mockImplementation(() => {
      throw new Error();
    });

    await request(app)
      .post('/register')
      .send(bodyMusician)
      .expect(500)
      .then(({ body: { msg } }) => {
        expect(msg).toStrictEqual('E_HASH_ERROR');
      });
  });
});
