import { APIRequestContext, expect } from '@playwright/test';
import { eventually } from './eventually';

export async function waitForIngress(api: APIRequestContext): Promise<void> {
  await eventually(async () => {
    const res = await api.get('/api/users/currentuser');

    // 401 means auth route is up and responding through ingress.
    if (res.status() !== 401) {
      throw new Error(`Ingress not ready yet, status=${res.status()}`);
    }

    expect(res.status()).toBe(401);
  }, { timeoutMs: 90_000, intervalMs: 1_000 });
}
