import { JetStreamClient, NatsConnection, Codec, JsMsg } from 'nats';
import {
  Subjects,
  NatsListener,
  TicketCreatedEvent,
  Streams,
} from '@rrpereztickets/common';
import { Ticket } from '../../models/ticket';
import { ticketCreatedWorker } from './queue-group-name';

export class TicketCreatedListener extends NatsListener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  stream: Streams.EventStream = Streams.EventStream;
  durableWorker: string = ticketCreatedWorker;
  // TODO: Modify the common module for it to support the definition of the name
  // of the durable worker in the constructor. Also, create methods to create the base
  // Stream, the subjects, the durable workers and the methods to probe whether the
  // previous items are already set up or not.
  async onMessage(decodedData: TicketCreatedEvent['data'], message: JsMsg) {
    const { id, title, price } = decodedData;
    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();
    message.ack();
  }
}
