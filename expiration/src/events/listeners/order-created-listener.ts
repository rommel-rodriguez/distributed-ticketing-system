import { orderCreatedWorker } from './queue-group-name';
import {
  NatsListener,
  OrderCreatedEvent,
  Subjects,
  Streams,
  OrderStatus,
} from '@rrpereztickets/common';
import { JsMsg } from 'nats';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends NatsListener<OrderCreatedEvent> {
  stream: Streams.EventStream = Streams.EventStream;
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  durableWorker: string = orderCreatedWorker;
  async onMessage(
    decodedData: {
      id: string;
      version: number;
      status: OrderStatus;
      userId: string;
      expiresAt: string;
      ticket: { id: string; price: number };
    },
    message: JsMsg
  ) {
    const delay =
      new Date(decodedData.expiresAt).getTime() - new Date().getTime();

    await expirationQueue.add({ orderId: decodedData.id }, { delay });

    message.ack();
  }
}
