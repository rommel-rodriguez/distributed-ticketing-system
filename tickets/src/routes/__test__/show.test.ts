import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the ticket is not found', async () => {
  const nonexistent_ticket_id: string =
    new mongoose.Types.ObjectId().toHexString();
  const find_url = `/api/tickets/${nonexistent_ticket_id}`;
  const response = await request(app)
    .get(find_url)
    .set('Cookie', global.signin())
    .send();
  console.log(response.body);
  expect(response.status).toBe(404);
});
it('returns the ticket if the ticket is found', async () => {
  const title = 'concert';
  const price = 20;
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title, price })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
