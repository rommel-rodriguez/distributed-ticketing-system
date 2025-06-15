import {
  NatsListener,
  OrderCancelledEvent,
  Subjects,
  Streams,
  OrderStatus,
} from '@rrpereztickets/common';
import { orderCancelledWorker } from './queue-group-name';
import { Order } from '../../models/order';
import { JsMsg } from 'nats';

export class OrderCancelledListener extends NatsListener<OrderCancelledEvent> {
  stream: Streams = Streams.EventStream;
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  durableWorker: string = orderCancelledWorker;
  async onMessage(decodedData: OrderCancelledEvent['data'], message: JsMsg) {
    // TODO: Extract this particular findone logic into a function included in the
    // model.
    const order = await Order.findOne({
      _id: decodedData.id,
      version: decodedData.version - 1,
    });

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Cancelled });

    await order.save();

    message.ack();
  }
}
