import { APIRequestContext, expect } from '@playwright/test';

export async function signUpAndGetCookie(api: APIRequestContext, email: string): Promise<string> {
  const response = await api.post('/api/users/signup', {
    data: {
      email,
      password: 'Passw0rd!'
    }
  });

  expect(response.status()).toBe(201);

  const cookie = response.headers()['set-cookie'];
  expect(cookie).toBeTruthy();

  return cookie!;
}
