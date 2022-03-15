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

  it('Return the musicians information filtered by location and name query', async () => {
    query.mockReturnValueOnce({
      rows: [
        {
          id: 'id1',
          email: 'test1@gmail.com',
          givenName: 'Romain',
          familyName: 'Guarinoni',
          phone: '0655443322',
          facebook_url: 'url',
          promotion: 'M1',
          location: 'Douai',
        },
        {
          id: 'id2',
          email: 'test2@gmail.com',
          givenName: 'Dorian',
          familyName: 'Viala',
          phone: '0655443322',
          facebook_url: 'url',
          promotion: 'M1',
          location: 'Douai',
        },
      ],
    });

    // Mock the instruments
    query.mockReturnValueOnce({ rows: [] });
    query.mockReturnValueOnce({ rows: [] });

    // Mock the genres
    query.mockReturnValueOnce({ rows: [] });
    query.mockReturnValueOnce({ rows: [] });

    await request(app)
      .get('/musicians?name=o&location=Douai&location=Lille')
      .set('Authorization', token)
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toStrictEqual(2);
        expect(body[0].id).toStrictEqual('id1');
        expect(body[1].id).toStrictEqual('id2');
      });
  });

  it('Return the musicians information filtered by genres and instruments query', async () => {
    query.mockReturnValueOnce({
      rows: [
        {
          id: 'id1',
          email: 'test1@gmail.com',
          givenName: 'Romain',
          familyName: 'Guarinoni',
          phone: '0655443322',
          facebook_url: 'url',
          promotion: 'M1',
          location: 'Douai',
        },
        {
          id: 'id2',
          email: 'test2@gmail.com',
          givenName: 'Dorian',
          familyName: 'Viala',
          phone: '0655443322',
          facebook_url: 'url',
          promotion: 'M1',
          location: 'Lille',
        },
        {
          id: 'id3',
          email: 'test3@gmail.com',
          givenName: 'Guillaume',
          familyName: 'Faure',
          phone: '0655443322',
          facebook_url: 'url',
          promotion: 'M1',
          location: 'Douai',
        },
      ],
    });

    // Mock the instruments
    query.mockReturnValueOnce({ rows: [{ id: 'id', name: 'drums' }] });
    query.mockReturnValueOnce({ rows: [] });
    query.mockReturnValueOnce({ rows: [] });

    // Mock the genres
    query.mockReturnValueOnce({ rows: [{ id: 'id', name: 'Metal' }] });
    query.mockReturnValueOnce({ rows: [] });
    query.mockReturnValueOnce({ rows: [] });

    await request(app)
      .get('/musicians?instruments=drums&genres=Metal')
      .set('Authorization', token)
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toStrictEqual(1);
        expect(body[0].id).toStrictEqual('id1');
      });
  });

  it("Return the information of a musician by it's id", async () => {
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
