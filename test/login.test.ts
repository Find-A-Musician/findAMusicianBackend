import axios, { AxiosResponse } from 'axios';

describe('Run login test', () => {
  let response: AxiosResponse;
  let access_token: string;
  let refresh_token: string;
  let new_access_token: string;
  it('Login a user', async () => {
    response = await axios({
      method: 'POST',
      url: 'http://localhost:8000/login',
      data: {
        email: 'romain.guar01@gmail.com',
        password: 'romain123',
      },
    });
    expect(response.status).toBe(200);
    expect(response.data.musician.email).toEqual('romain.guar01@gmail.com');
    access_token = response.data.token.accessToken;
    refresh_token = response.data.token.refreshToken;
  });
  it('Get the user profil', async () => {
    response = await axios({
      method: 'GET',
      url: 'http://localhost:8000/profil',
      headers: { Authorization: `Bearer ${access_token}` },
    });
    expect(response.status).toBe(200);
    expect(response.data.genres).toBeInstanceOf(Array);
    expect(response.data.instruments).toBeInstanceOf(Array);
  });
  it('Get a new Access token', async () => {
    response = await axios({
      method: 'POST',
      url: 'http://localhost:8000/refresh_token',
      data: {
        refreshToken: refresh_token,
      },
    });
    expect(response.status).toBe(200);
    expect(typeof response.data.accessToken).toBe('string');
    new_access_token = response.data.accessToken;
  });
  it('logout the user', async () => {
    response = await axios({
      method: 'DELETE',
      url: 'http://localhost:8000/logout',
      headers: { Authorization: `Bearer ${new_access_token}` },
    });
    expect(response.status).toBe(200);
  });
});
