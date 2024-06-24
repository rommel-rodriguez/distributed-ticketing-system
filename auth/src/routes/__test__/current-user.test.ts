import request from 'supertest';
import { app } from '../../app';

const user = { email: 'test@test.com', password: 'password' };

it('Responds with details about the current user', async () => {
  // const authResponse = await request(app)
  //   .post('/api/users/signup')
  //   .send(user)
  //   .expect(201);

  // const cookie = authResponse.get('Set-Cookie');
  const cookie = await global.signin();

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie ? cookie : [])
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('Responds with null if the user is not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(401);
  expect(response.body.currentUser).toEqual(undefined);
});
