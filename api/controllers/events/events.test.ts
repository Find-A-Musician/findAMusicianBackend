import pg from '../../postgres';
import request from 'supertest';
import app from '../../server/server';
import generateToken, { GrantTypes } from '../../auth/generateToken';

jest.mock('../../postgres');

describe('/events', () => {
  const query = pg.query as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Return the events list', async () => {
    query.mockReturnValueOnce({
      rows: [
        {
          id: 'id',
          name: 'name',
          description: 'description',
          start_date: new Date(2000, 11, 13),
          end_date: new Date(2000, 11, 13),
          adress: 'adress',
        },
      ],
    });
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
          instruments: [{ id: 'id', name: 'name' }],
          genres: [
            {
              id: 'id',
              name: 'genre',
            },
          ],
        },
      ],
    });

    await request(app)
      .get('/events')
      .set(
        'Authorization',
        `Bearer ${generateToken(
          GrantTypes.AuthorizationCode,
          '8f6c1dd5-7444-46c9-b673-840731bfd041',
        )}`,
      )
      .expect(200)
      .then(({ body }) => {
        expect(body).toStrictEqual([
          {
            id: 'id',
            name: 'name',
            description: 'description',
            start_date: new Date(2000, 11, 13).toISOString(),
            end_date: new Date(2000, 11, 13).toISOString(),
            adress: 'adress',
            admin: {
              id: 'id',
              email: 'test@gmail.com',
              givenName: 'Test',
              familyName: 'test',
              phone: '0655443322',
              facebook_url: 'url',
              promotion: 'M1',
              location: 'Douai',
              instruments: [{ id: 'id', name: 'name' }],
              genres: [
                {
                  id: 'id',
                  name: 'genre',
                },
              ],
            },
          },
        ]);
      });
  });

  it('Create a new event', async () => {
    const body = {
      id: 'id',
      name: 'name',
      description: 'description',
      start_date: new Date(Date.now()),
      end_date: new Date(Date.now()),
      adress: 'adress',
    };

    query.mockReturnValueOnce({});

    await request(app)
      .post('/events')
      .set(
        'Authorization',
        `Bearer ${generateToken(
          GrantTypes.AuthorizationCode,
          '8f6c1dd5-7444-46c9-b673-840731bfd041',
        )}`,
      )
      .send(body)
      .expect(201);
  });

  it('Cannot create new event bcs name is already taken', async () => {
    const body = {
      id: 'id',
      name: 'already taken name',
      description: 'description',
      start_date: new Date(Date.now()),
      end_date: new Date(Date.now()),
      adress: 'adress',
    };

    query.mockImplementation(() => {
      throw {
        constraint: 'events_name_key',
      };
    });

    await request(app)
      .post('/events')
      .set(
        'Authorization',
        `Bearer ${generateToken(
          GrantTypes.AuthorizationCode,
          '8f6c1dd5-7444-46c9-b673-840731bfd041',
        )}`,
      )
      .send(body)
      .expect(401)
      .then(({ body: { msg } }) => {
        expect(msg).toStrictEqual('E_EVENT_NAME_ALREADY_TAKEN');
      });
  });

  it("Return an event by it's Id", async () => {
    query.mockReturnValueOnce({
      rows: [
        {
          id: 'id',
          name: 'name',
          description: 'description',
          start_date: new Date(2000, 11, 13),
          end_date: new Date(2000, 11, 13),
          adress: 'adress',
        },
      ],
    });
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
          instruments: [{ id: 'id', name: 'name' }],
          genres: [
            {
              id: 'id',
              name: 'genre',
            },
          ],
        },
      ],
    });

    await request(app)
      .get('/events/id')
      .set(
        'Authorization',
        `Bearer ${generateToken(
          GrantTypes.AuthorizationCode,
          '8f6c1dd5-7444-46c9-b673-840731bfd041',
        )}`,
      )
      .expect(200)
      .then(({ body }) => {
        expect(body).toStrictEqual({
          id: 'id',
          name: 'name',
          description: 'description',
          start_date: new Date(2000, 11, 13).toISOString(),
          end_date: new Date(2000, 11, 13).toISOString(),
          adress: 'adress',
          admin: {
            id: 'id',
            email: 'test@gmail.com',
            givenName: 'Test',
            familyName: 'test',
            phone: '0655443322',
            facebook_url: 'url',
            promotion: 'M1',
            location: 'Douai',
            instruments: [{ id: 'id', name: 'name' }],
            genres: [
              {
                id: 'id',
                name: 'genre',
              },
            ],
          },
        });
      });
  });

  it("The event doesn't exist", async () => {
    query.mockReturnValueOnce({
      rows: [],
    });

    await request(app)
      .get('/events/id')
      .set(
        'Authorization',
        `Bearer ${generateToken(
          GrantTypes.AuthorizationCode,
          '8f6c1dd5-7444-46c9-b673-840731bfd041',
        )}`,
      )
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toStrictEqual('E_EVENT_DOES_NOT_EXIST');
      });
  });

  it("Patch an event by it's id", async () => {
    const body = {
      name: 'already taken name',
      description: 'description',
      start_date: new Date(Date.now()),
      end_date: new Date(Date.now()),
      adress: 'adress',
    };

    query.mockReturnValueOnce({
      rows: [{ admin: '8f6c1dd5-7444-46c9-b673-840731bfd041' }],
    });

    query.mockReturnValueOnce({});

    await request(app)
      .patch('/events/id')
      .set(
        'Authorization',
        `Bearer ${generateToken(
          GrantTypes.AuthorizationCode,
          '8f6c1dd5-7444-46c9-b673-840731bfd041',
        )}`,
      )
      .send(body)
      .expect(200);
  });

  it("Cannot patch bcs the event doesn't exist", async () => {
    const body = {
      name: 'already taken name',
      description: 'description',
      start_date: new Date(Date.now()),
      end_date: new Date(Date.now()),
      adress: 'adress',
    };

    query.mockReturnValueOnce({
      rows: [],
    });

    await request(app)
      .patch('/events/id')
      .set(
        'Authorization',
        `Bearer ${generateToken(
          GrantTypes.AuthorizationCode,
          '8f6c1dd5-7444-46c9-b673-840731bfd041',
        )}`,
      )
      .send(body)
      .expect(404)
      .then(({ body: { msg } }) =>
        expect(msg).toStrictEqual('E_EVENT_DOES_NOT_EXIST'),
      );
  });

  it('Cannot patch bcs the user is not an admin', async () => {
    const body = {
      name: 'already taken name',
      description: 'description',
      start_date: new Date(Date.now()),
      end_date: new Date(Date.now()),
      adress: 'adress',
    };

    query.mockReturnValueOnce({
      rows: [{ admin: 'id' }],
    });

    await request(app)
      .patch('/events/id')
      .set(
        'Authorization',
        `Bearer ${generateToken(
          GrantTypes.AuthorizationCode,
          '8f6c1dd5-7444-46c9-b673-840731bfd041',
        )}`,
      )
      .send(body)
      .expect(403)
      .then(({ body: { msg } }) =>
        expect(msg).toStrictEqual('E_UNAUTHORIZED_USER'),
      );
  });

  it('Delete an event by it`s id', async () => {
    query.mockReturnValueOnce({
      rows: [{ admin: '8f6c1dd5-7444-46c9-b673-840731bfd041' }],
    });

    query.mockReturnValueOnce({});

    await request(app)
      .delete('/events/id')
      .set(
        'Authorization',
        `Bearer ${generateToken(
          GrantTypes.AuthorizationCode,
          '8f6c1dd5-7444-46c9-b673-840731bfd041',
        )}`,
      )
      .expect(200);
  });

  it("Cannot delete bcs the event doesn't exist", async () => {
    query.mockReturnValueOnce({
      rows: [],
    });

    await request(app)
      .delete('/events/id')
      .set(
        'Authorization',
        `Bearer ${generateToken(
          GrantTypes.AuthorizationCode,
          '8f6c1dd5-7444-46c9-b673-840731bfd041',
        )}`,
      )
      .expect(404)
      .then(({ body: { msg } }) =>
        expect(msg).toStrictEqual('E_EVENT_DOES_NOT_EXIST'),
      );
  });

  it('Cannot delete bcs the user is not an admin', async () => {
    query.mockReturnValueOnce({
      rows: [{ admin: 'id' }],
    });

    await request(app)
      .delete('/events/id')
      .set(
        'Authorization',
        `Bearer ${generateToken(
          GrantTypes.AuthorizationCode,
          '8f6c1dd5-7444-46c9-b673-840731bfd041',
        )}`,
      )
      .expect(403)
      .then(({ body: { msg } }) =>
        expect(msg).toStrictEqual('E_UNAUTHORIZED_USER'),
      );
  });
});
