import { test, expect } from '@playwright/test';
import { waitForIngress } from '../../helpers/healthcheck';
import { eventually } from '../../helpers/eventually';
import { uniqueEmail, uniqueTicketTitle } from '../../helpers/factory';
import { signUpAndGetCookie } from '../../helpers/auth';

test.describe('Cross-service smoke flow', () => {
  test('@smoke create ticket, create order, cancel order, observe ticket unlock', async ({ request }) => {
    await waitForIngress(request);

    const email = uniqueEmail('flow');
    const cookie = await signUpAndGetCookie(request, email);

    const createTicket = await request.post('/api/tickets', {
      headers: { cookie },
      data: {
        title: uniqueTicketTitle(),
        price: 50,
      },
    });

    expect(createTicket.status()).toBe(201);
    const ticket = await createTicket.json();
    expect(ticket.id).toBeTruthy();

    const order = await eventually(async () => {
      const res = await request.post('/api/orders', {
        headers: { cookie },
        data: { ticketId: ticket.id },
      });

      // While event replication catches up, order service may still not have this ticket.
      if (res.status() !== 201) {
        throw new Error(`order not ready yet, status=${res.status()}`);
      }

      return res.json();
    }, { timeoutMs: 45_000, intervalMs: 750 });

    expect(order.id).toBeTruthy();

    await eventually(async () => {
      const res = await request.get(`/api/tickets/${ticket.id}`);
      expect(res.status()).toBe(200);
      const updated = await res.json();

      // ticket service should mark ticket as reserved by this order
      if (updated.orderId !== order.id) {
        throw new Error('ticket reservation not propagated yet');
      }
    }, { timeoutMs: 30_000, intervalMs: 750 });

    const cancelOrder = await request.delete(`/api/orders/${order.id}`, {
      headers: { cookie },
    });

    expect(cancelOrder.status()).toBe(204);

    await eventually(async () => {
      const res = await request.get(`/api/tickets/${ticket.id}`);
      expect(res.status()).toBe(200);

      const updated = await res.json();
      if (updated.orderId) {
        throw new Error('ticket is still reserved after order cancellation');
      }
    }, { timeoutMs: 30_000, intervalMs: 750 });
  });
});
