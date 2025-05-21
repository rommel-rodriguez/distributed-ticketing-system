import { Ticket } from '../../../models/ticket';
import { JsMsg } from 'nats';
import { TicketCreatedEvent } from '@rrpereztickets/common';
import mongoose from 'mongoose';
import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';

const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.connection);
  // Create fake decodedData and message objects
  const decodedData: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object, the ts-ignore instructs
  // Typescript, that it should not worry about the msg
  // object not implementing all the methods and attributes
  // of the class is types after, in this case JsMsg.
  // @ts-ignore
  const msg: JsMsg = {
    ack: jest.fn(),
  };

  return { listener, decodedData, msg };
};

it('creates a ticket and stores it in the database', async () => {
  const { listener, decodedData, msg } = await setup();

  // call the function
  await listener.onMessage(decodedData, msg);
  // Assert that the changes were done correctly
  const ticket = await Ticket.findById(decodedData.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(decodedData.title);
  expect(ticket!.price).toEqual(decodedData.price);
});

it('acks the received event correctly', () => {});
