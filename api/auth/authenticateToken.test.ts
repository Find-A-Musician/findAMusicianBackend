import supertest from 'supertest';
import app from '../server/server';
import generateToken, { GrantTypes } from './generateToken';

describe('Test the Bearer token authentification middleware', () => {
  it('accept the Bearer token', async () => {
    const token = generateToken(
      GrantTypes.AuthorizationCode,
      '8f6c1dd5-7444-46c9-b673-840731bfd041',
    );
    const authorization = `Bearer ${token}`;
    await supertest(app)
      .get('/test')
      .set('Authorization', authorization)
      .expect(200)
      .then((response) => {
        expect(response.body.userId).toStrictEqual(
          '8f6c1dd5-7444-46c9-b673-840731bfd041',
        );
      });
  });

  it('reject the Bearer token because it is invalid token', async () => {
    const token = 'fakeToken';
    await supertest(app)
      .get('/test')
      .set('Authorization', 'bearer ' + token)
      .expect(403);
  });

  it('reject the Bearer token because it is a refresh token', async () => {
    const token = generateToken(GrantTypes.RefreshToken, 'userId');
    await supertest(app)
      .get('/test')
      .set('Authorization', 'bearer ' + token)
      .expect(403);
  });

  it('notify the empty token', async () => {
    await supertest(app)
      .get('/test')
      .set('Authorization', '')
      .expect(401)
      .then(({ body: { message } }) => {
        expect(message).toStrictEqual('Authorization header required');
      });
  });
});
