import jwt from 'jsonwebtoken';
import supertest from 'supertest';
import app from '../server/server';

describe('Test the Bearer token authentification middleware', () => {
  it('accept the Bearer token', async () => {
    const token = jwt.sign(
        {userId: '8f6c1dd5-7444-46c9-b673-840731bfd041'},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '1d'},
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
    // await supertest(app)
    //     .get('/musicians')
    //     .set('Authorization', authorization)
    //     .expect(200);
  });

  it('reject the Bearer token', async () => {
    const token = 'fakeToken';
    await supertest(app)
        .get('/me')
        .set('Authorization', 'bearer ' + token)
        .expect(403);
  });

  it('notify the empty token', async () => {
    await supertest(app)
        .get('/me')
        .expect(401);
  });
});
