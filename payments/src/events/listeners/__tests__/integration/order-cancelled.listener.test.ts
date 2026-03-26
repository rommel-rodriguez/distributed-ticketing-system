import mongoose from 'mongoose';
import { OrderCancelledEvent, OrderStatus } from '@rrpereztickets/common';
import { OrderCancelledListener } from '../../order-cancelled-listener';
import { natsWrapper } from '../../../../nats-wrapper';
import { Order } from '../../../../models/order';
import { JsMsg } from 'nats';

const setup = async () => {
  const listener = await new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: 'notusedhere',
    price: 35,
    status: OrderStatus.Created,
  });

  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'notusedhere',
    },
  };

  // @ts-ignore
  const msg: JsMsg = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

it('updates the status of the order', async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
