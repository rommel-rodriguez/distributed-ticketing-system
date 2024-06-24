import request from 'supertest';
import { app } from '../../app';
import { User } from '../../models/user';

const user = { email: 'test@test.com', password: 'password' };

async function createUser(newUser: { email: string; password: string }) {
  const user = User.build(newUser);
  await user.save();
  return user;
}

it('Existing user signs in correctly', async () => {
  // NOTE: Maybe it would be better if we use the User model to create a new user here
  // await request(app).post('/api/users/signup').send(user).expect(201);
  await createUser(user);

  await request(app).post('/api/users/signin').send(user).expect(200);
});

it('Existing user with incorrect password returns 400', async () => {
  await request(app).post('/api/users/signin').send(user).expect(400);
});

it('Non-existing user returns 400', async () => {
  await createUser(user);
  await request(app)
    .post('/api/users/signin')
    .send({ ...user, password: 'not-right' })
    .expect(400);
});

it('Sets a cookie when the credentials are valid', async () => {
  await createUser(user);
  const response = await request(app)
    .post('/api/users/signin')
    .send(user)
    .expect(200);
  expect(response.get('Set-Cookie')).toBeDefined();
});
