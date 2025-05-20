import { JsMsg } from 'nats';
import {
  Subjects,
  NatsListener,
  TicketUpdatedEvent,
  Streams,
} from '@rrpereztickets/common';

import { Ticket } from '../../models/ticket';
import { ticketUpdatedWorker } from './queue-group-name';

export class TicketUpdatedListener extends NatsListener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  stream: Streams.EventStream = Streams.EventStream;
  durableWorker: string = ticketUpdatedWorker;

  async onMessage(decodedData: TicketUpdatedEvent['data'], message: JsMsg) {
    const ticket = await Ticket.findOne({
      _id: decodedData.id,
      version: decodedData.version - 1,
    });

    if (!ticket) {
      throw new Error('Ticket to be updated not found');
    }

    const { title, price } = decodedData;
    ticket.set({ title, price });
    await ticket.save();
    message.ack();
  }
}
