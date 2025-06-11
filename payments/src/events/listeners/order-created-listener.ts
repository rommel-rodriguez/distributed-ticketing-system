import {
  NatsListener,
  OrderCreatedEvent,
  OrderStatus,
  Streams,
  Subjects,
} from '@rrpereztickets/common';

import { orderCreatedWorker } from './queue-group-name';
import { JsMsg } from 'nats';
import { Order } from '../../models/order';

export class OrderCreatedListener extends NatsListener<OrderCreatedEvent> {
  stream: Streams = Streams.EventStream;
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  durableWorker: string = orderCreatedWorker;
  async onMessage(decodedData: OrderCreatedEvent['data'], message: JsMsg) {
    const order = Order.build({
      id: decodedData.id,
      price: decodedData.ticket.price,
      userId: decodedData.userId,
      status: decodedData.status,
      version: decodedData.version,
    });

    await order.save();

    message.ack();
  }
}
