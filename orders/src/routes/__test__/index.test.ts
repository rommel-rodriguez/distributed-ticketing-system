import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  return ticket;
};

it('fetches orders for a particular user', async () => {
  // Create three tickets
  const ticketEins = await buildTicket();
  const ticketZwei = await buildTicket();
  const ticketDrei = await buildTicket();

  const userEins = global.signin();
  const userZwei = global.signin();
  // Create one order as User #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userEins)
    .send({ ticketId: ticketEins.id })
    .expect(201);
  // Create two orders as User #2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userZwei)
    .send({ ticketId: ticketZwei.id })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userZwei)
    .send({ ticketId: ticketDrei.id })
    .expect(201);
  // Make request to get order for User #2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userZwei)
    .expect(200);
  // Make sure we only got the orders for User #2
  // NOTE: Not ideal, the following logic in this test
  // relies on the service returning the orders in a particular order
  // the test should NOT rely on such an assumption.
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].ticket.id).toEqual(ticketZwei.id);
  expect(response.body[1].ticket.id).toEqual(ticketDrei.id);
  // console.log(response.body);
});
