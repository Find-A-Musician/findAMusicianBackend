import axios, { AxiosResponse } from 'axios';

describe('Run login test', () => {
  it('Login a user', async () => {
    let response: AxiosResponse;

    response = await axios({
      method: 'POST',
      url: 'http://localhost:8000/login',
      data: {
        email: 'john.doe@gmail.com',
        password: 'password',
      },
    });

    expect(response.status).toBe(200);
    expect(response.data.musician.email).toEqual('john.doe@gmail.com');

    const access_token = response.data.token.accessToken;
    const refresh_token = response.data.token.refreshToken;
    response = await axios({
      method: 'GET',
      url: 'http://localhost:8000/profil',
      headers: { Authorization: `Bearer ${access_token}` },
    });

    expect(response.status).toBe(200);
    expect(response.data.genres).toBeInstanceOf(Array);
    expect(response.data.instruments).toBeInstanceOf(Array);

    response = await axios({
      method: 'POST',
      url: 'http://localhost:8000/refresh_token',
      data: {
        refreshToken: refresh_token,
      },
    });

    expect(response.status).toBe(200);
    expect(typeof response.data.accessToken).toBe('string');

    const new_access_token = response.data.accessToken;

    response = await axios({
      method: 'DELETE',
      url: 'http://localhost:8000/logout',
      headers: { Authorization: `Bearer ${new_access_token}` },
    });

    expect(response.status).toBe(200);
  });
});

export {};
