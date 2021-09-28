import axios from 'axios';
// import assert from 'assert';

export default async function login(): Promise<void> {
  try {
    const response = await axios({
      method: 'POST',
      url: 'http://localhost:8000/login',
      data: {
        email: 'john.doe@gmail.com',
        password: 'password',
      },
      validateStatus: (status) => status === 201,
    });
    // assert.deepEqual()
    // console.log(response);
  } catch (err) {
    console.error(
      JSON.stringify(err.response ? err.response.data : err.stack, null, 2),
      'BUG',
    );
    throw err;
  }
}
