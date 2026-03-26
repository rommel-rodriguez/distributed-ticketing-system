import mongoose from 'mongoose';
import { JsMsg } from 'nats';
import { OrderStatus, ExpirationCompleteEvent } from '@rrpereztickets/common';
import { ExpirationCompleteListener } from '../../expiration-complete-listener';
import { natsWrapper } from '../../../../nats-wrapper';
import { Order } from '../../../../models/order';
import { Ticket } from '../../../../models/ticket';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'alskdfj',
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: JsMsg = {
    ack: jest.fn(),
  };

  return { listener, order, ticket, data, msg };
};
