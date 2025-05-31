import {
  NatsListener,
  OrderCreatedEvent,
  Subjects,
  Streams,
  OrderStatus,
} from '@rrpereztickets/common';
import { JsMsg } from 'nats';
import { orderCreatedWorker } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends NatsListener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  stream: Streams.EventStream = Streams.EventStream;
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
    const ticket = await Ticket.findById(decodedData.ticket.id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ orderId: decodedData.id });

    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    message.ack();
  }
}
