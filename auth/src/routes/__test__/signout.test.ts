import request from 'supertest';
import { app } from '../../app';

const user = { email: 'test@test.com', password: 'password' };

it('Unsets the cookie header', async () => {
  const sessionPattern = '/session=([^;]+)/';
  const signupResponse = await request(app)
    .post('/api/users/signup')
    .send(user)
    .expect(201);
  // console.log(signupResponse.get('Set-Cookie')?.toString());
  const response = await request(app)
    .post('/api/users/signout')
    .send(user)
    .expect(200);
  expect(response.get('Set-Cookie')).toBeDefined();
  const cookie: string[] | undefined = response.get('Set-Cookie');
  if (cookie) {
    const sessionCookie = cookie[0];
    const sessionSection = sessionCookie.split(';')[0];

    expect(sessionSection.split('=').filter((el) => el !== '')).toHaveLength(1);
  }
});
