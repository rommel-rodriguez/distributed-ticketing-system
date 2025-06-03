import {
  NatsListener,
  OrderCancelledEvent,
  Subjects,
  Streams,
} from '@rrpereztickets/common';
import { JsMsg } from 'nats';
import { orderCancelledWorker } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends NatsListener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  stream: Streams.EventStream = Streams.EventStream;
  durableWorker: string = orderCancelledWorker;

  async onMessage(
    decodedData: { id: string; version: number; ticket: { id: string } },
    message: JsMsg
  ) {
    const ticket = await Ticket.findById(decodedData.ticket.id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ orderId: undefined });
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId: ticket.orderId,
      userId: ticket.userId,
      price: ticket.price,
      title: ticket.title,
      version: ticket.version,
    });

    message.ack();
  }
}
