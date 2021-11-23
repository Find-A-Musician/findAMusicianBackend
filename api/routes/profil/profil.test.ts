import app from '../../server/server';
import request from 'supertest';
import pg from '../../postgres';
import generateToken, { GrantTypes } from '../../auth/generateToken';
import supertest from 'supertest';

jest.mock('../../postgres');

describe('/profil', () => {
  const query = pg.query as jest.Mock;

  const token = `Bearer ${generateToken(
    GrantTypes.AuthorizationCode,
    '8f6c1dd5-7444-46c9-b673-840731bfd041',
  )}`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Return the user profil', async () => {
    query.mockReturnValueOnce({
      rows: [
        {
          id: 'id',
          email: 'test@gmail.com',
        },
      ],
    });

    query.mockReturnValueOnce({
      rows: [
        {
          id: 'id',
          name: 'Batterie',
        },
      ],
    });

    query.mockReturnValueOnce({
      rows: [
        {
          id: 'id',
          name: 'metal',
        },
      ],
    });

    await request(app)
      .get('/profil')
      .set('Authorization', token)
      .expect(200)
      .then(({ body }) => {
        expect(body.musician.email).toStrictEqual('test@gmail.com');
        expect(body.instruments[0].name).toStrictEqual('Batterie');
        expect(body.genres[0].name).toStrictEqual('metal');
      });
  });

  it('Delete the user profil', async () => {
    query.mockReturnValueOnce({});
    await supertest(app)
      .delete('/profil')
      .set('Authorization', token)
      .expect(200)
      .then(({ body }) =>
        expect(body).toStrictEqual('The user has been deleted'),
      );
  });

  it('Update the profil', async () => {
    const body = {
      givenName: 'name',
      familyName: 'name',
      phone: 'phone',
      facebook_url: 'url',
      twitter_url: 'url',
      instagram_url: 'url',
      promotion: 'M1',
      location: 'Douai',
      genres: [
        {
          id: 'id',
          name: 'name',
        },
        {
          id: 'id',
          name: 'name',
        },
      ],
      instruments: [
        {
          id: 'id',
          name: 'name',
        },
        {
          id: 'id',
          name: 'name',
        },
      ],
    };

    let nbMockCall = 0;
    // Mock the db
    for (let i = 0; i < Object.keys(body).length; i++) {
      if (Array.isArray(Object.values(body)[i])) {
        //delete mock

        query.mockReturnValueOnce({});
        nbMockCall++;
        for (let j = 0; j < Object.values(body)[i].length; j++) {
          // insert mock
          query.mockReturnValueOnce({});
          nbMockCall++;
        }
      } else {
        //update mock
        query.mockReturnValueOnce({});
        nbMockCall++;
      }
    }

    await supertest(app)
      .patch('/profil')
      .set('Authorization', token)
      .send(body)
      .expect(200)
      .then(() => expect(query).toBeCalledTimes(nbMockCall));
  });

  it('Error while updating genres ', async () => {
    const body = {
      genres: [
        {
          id: 'id',
          name: 'name',
        },
        {
          id: 'id',
          name: 'name',
        },
      ],
    };

    query.mockImplementation(() => {
      throw new Error();
    });

    await supertest(app)
      .patch('/profil')
      .set('Authorization', token)
      .send(body)
      .expect(500)
      .then(({ body: { msg } }) =>
        expect(msg).toStrictEqual('E_SQL_ERROR_GENRES'),
      );
  });

  it('Error while updating instruments ', async () => {
    const body = {
      instruments: [
        {
          id: 'id',
          name: 'name',
        },
        {
          id: 'id',
          name: 'name',
        },
      ],
    };

    query.mockImplementation(() => {
      throw new Error();
    });

    await supertest(app)
      .patch('/profil')
      .set('Authorization', token)
      .send(body)
      .expect(500)
      .then(({ body: { msg } }) =>
        expect(msg).toStrictEqual('E_SQL_ERROR_INSTRUMENTS'),
      );
  });
});
