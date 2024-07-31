import {
  BaseNatsPublisher,
  Subjects,
  TicketCreatedEvent,
  Streams,
} from '@rrpereztickets/common';

export class TicketCreatedPublisher extends BaseNatsPublisher<TicketCreatedEvent> {
  stream: Streams.EventStream = Streams.EventStream;
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
