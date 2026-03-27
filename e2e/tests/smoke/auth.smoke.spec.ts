import { test, expect } from '@playwright/test';
import { waitForIngress } from '../../helpers/healthcheck';
import { uniqueEmail } from '../../helpers/factory';
import { signUpAndGetCookie } from '../../helpers/auth';

test.describe('Auth Smoke', () => {
  test('@smoke sign up and read current user through ingress', async ({ request }) => {
    await waitForIngress(request);

    const email = uniqueEmail('auth');
    const cookie = await signUpAndGetCookie(request, email);

    const me = await request.get('/api/users/currentuser', {
      headers: { cookie },
    });

    expect(me.status()).toBe(200);
    const body = await me.json();

    expect(body.currentUser).toBeTruthy();
    expect(body.currentUser.email).toBe(email);
    expect(typeof body.currentUser.id).toBe('string');
  });
});
