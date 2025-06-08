import {
  NatsListener,
  OrderStatus,
  Streams,
  Subjects,
} from '@rrpereztickets/common';
import { ExpirationCompleteEvent } from '@rrpereztickets/common';
import { JsMsg } from 'nats';
import { expirationCompleteWorker } from './queue-group-name';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends NatsListener<ExpirationCompleteEvent> {
  stream: Streams = Streams.EventStream;
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  durableWorker: string = expirationCompleteWorker;
  async onMessage(decodedData: { orderId: string }, message: JsMsg) {
    const order = await Order.findById(decodedData.orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found!');
    }

    order.set({ status: OrderStatus.Cancelled });

    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    message.ack();
  }
}
