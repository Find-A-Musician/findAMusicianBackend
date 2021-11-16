import queryMock from '../postgres';
import app from '../server/server';
import request from 'supertest';
import generateToken, { GrantTypes } from '../auth/generateToken';

jest.mock('../postgres');

describe('/refreshToken', () => {
  const query = queryMock as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const refreshToken = generateToken(GrantTypes.RefreshToken, 'id');
  const accessToken = generateToken(GrantTypes.AuthorizationCode, 'id');

  const validBody = { refreshToken: refreshToken };
  const invalidBody = { refreshToken: accessToken };
  const outdatedBody = { refreshToken: 'outdated' };

  it('Return a new access token', async () => {
    query.mockReturnValueOnce({
      rows: [
        {
          id: 'id',
          token: refreshToken,
          musician: 'id',
        },
      ],
    });

    await request(app)
      .post('/refresh_token')
      .send(validBody)
      .expect(200)
      .then(({ body }) => {
        expect(Boolean(body['accessToken'])).toBe(true);
      });
  });

  it('Failed because the token is not in the DB', async () => {
    query.mockReturnValueOnce({
      rows: [],
    });

    await request(app)
      .post('/refresh_token')
      .send(validBody)
      .expect(401)
      .then(({ body: { msg } }) => {
        expect(msg).toStrictEqual('E_INVALID_REFRESH_TOKEN');
      });
  });

  it('Failed because the token is an accessToken', async () => {
    query.mockReturnValueOnce({
      rows: [
        {
          id: 'id',
          token: 'invalidToken',
          musician: 'id',
        },
      ],
    });

    await request(app)
      .post('/refresh_token')
      .send(invalidBody)
      .expect(401)
      .then(({ body: { msg } }) => {
        expect(msg).toStrictEqual('E_INVALID_REFRESH_TOKEN');
      });
  });

  it('Failed because the token is outdated', async () => {
    query.mockReturnValueOnce({
      rows: [
        {
          id: 'id',
          token: 'invalidToken',
          musician: 'id',
        },
      ],
    });

    await request(app)
      .post('/refresh_token')
      .send(outdatedBody)
      .expect(401)
      .then(({ body: { msg } }) => {
        expect(msg).toStrictEqual('E_INVALID_REFRESH_TOKEN');
      });
  });
});
