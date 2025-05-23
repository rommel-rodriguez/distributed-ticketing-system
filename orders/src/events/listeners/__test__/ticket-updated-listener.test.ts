import { TicketUpdatedListener } from '../ticket-updated-listener';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { TicketUpdatedEvent } from '@rrpereztickets/common';

const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.connection);
  // Create fake data for the original ticket
  const data = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
  };

  // create fake data for the Update Ticket event
  const updatedData: TicketUpdatedEvent['data'] = {
    id: data.id,
    version: 1,
    // title: 'Musical',
    title: data.title,
    price: 34.5,
    // The event must include the userId, even if the listener does not use it
    // to update the event
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // create a new ticket with the original data
  const ticket = Ticket.build(data);
  await ticket.save();
  // create a fake message object, the ts-ignore instructs
  // Typescript, that it should not worry about the msg
  // object not implementing all the methods and attributes
  // of the class is types after, in this case JsMsg.
  // @ts-ignore
  const msg: JsMsg = {
    ack: jest.fn(),
  };

  return { listener, data, updatedData, msg };
};
it('correctly updates the ticket', async () => {
  const { listener, data, updatedData, msg } = await setup();

  await listener.onMessage(updatedData, msg);

  const updatedTicket = await Ticket.findById(data.id);

  expect(updatedTicket!.title).toEqual(updatedData.title);
  expect(updatedTicket!.price).not.toEqual(data.price);
  expect(updatedTicket!.price).toEqual(updatedData.price);
  expect(updatedTicket!.version).toEqual(updatedData.version);
});

it('acks the message after processing the update', async () => {
  const { listener, data, updatedData, msg } = await setup();

  await listener.onMessage(updatedData, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not ack if the event has a skipped version number', async () => {
  const { listener, data, updatedData, msg } = await setup();
  updatedData.version = 10;

  try {
    await listener.onMessage(updatedData, msg);
  } catch (err) {}
  expect(msg.ack).not.toHaveBeenCalled();
});
