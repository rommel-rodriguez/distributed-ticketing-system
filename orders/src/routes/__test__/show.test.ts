import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order } from '../../models/order';

it('fetches the order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  const user = global.signin();

  // Make a request to build an order with this ticket
  const { body: orderBody } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
  // make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${orderBody.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(fetchedOrder.id);
});

it('returns an error if one user tried to fetch another users order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  const user = global.signin();

  // Make a request to build an order with this ticket
  const { body: orderBody } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
  // make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${orderBody.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});
