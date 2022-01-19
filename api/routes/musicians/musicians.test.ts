import app from '../../server/server';
import request from 'supertest';
import pg from '../../postgres';
import generateToken, { GrantTypes } from '../../auth/generateToken';

jest.mock('../../postgres');

describe('/musicians', () => {
  const query = pg.query as jest.Mock;

  const token = `Bearer ${generateToken(
    GrantTypes.AuthorizationCode,
    '8f6c1dd5-7444-46c9-b673-840731bfd041',
  )}`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Return all the musicians', async () => {
    query.mockReturnValueOnce({
      rows: [
        {
          id: 'id',
          email: 'test@gmail.com',
          givenName: 'Test',
          familyName: 'test',
          phone: '0655443322',
          facebook_url: 'url',
          promotion: 'M1',
          location: 'Douai',
        },
      ],
    });

    query.mockReturnValueOnce({
      rows: [
        {
          id: 'instrumentId',
          name: 'drums',
        },
      ],
    });

    query.mockReturnValueOnce({
      rows: [
        {
          id: 'genreId',
          name: 'metal',
        },
      ],
    });

    await request(app)
      .get('/musicians')
      .set('Authorization', token)
      .expect(200)
      .then(({ body }) => {
        expect(body[0]['genres'][0]['id']).toStrictEqual('genreId');
        expect(body[0]['instruments'][0]['id']).toStrictEqual('instrumentId');
      });
  });

  it("Return the inormation of a musician by it's id", async () => {
    query.mockReturnValueOnce({
      rows: [
        {
          id: 'id',
          email: 'test@gmail.com',
          givenName: 'Test',
          familyName: 'test',
          phone: '0655443322',
          facebook_url: 'url',
          promotion: 'M1',
          location: 'Douai',
        },
      ],
    });

    query.mockReturnValueOnce({
      rows: [
        {
          id: 'instrumentId',
          name: 'drums',
        },
      ],
    });

    query.mockReturnValueOnce({
      rows: [
        {
          id: 'genreId',
          name: 'metal',
        },
      ],
    });

    await request(app)
      .get('/musicians/id')
      .set('Authorization', token)
      .expect(200)
      .then(({ body }) => {
        expect(body['genres'][0]['id']).toStrictEqual('genreId');
        expect(body['instruments'][0]['id']).toStrictEqual('instrumentId');
      });
  });

  it('The musician does not exist', async () => {
    query.mockReturnValueOnce({
      rows: [],
    });

    await request(app)
      .get('/musicians/id')
      .set('Authorization', token)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toStrictEqual('E_MUSICIAN_DOES_NOT_EXIST');
      });
  });
});
