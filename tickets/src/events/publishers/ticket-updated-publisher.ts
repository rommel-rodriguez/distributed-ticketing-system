import {
  BaseNatsPublisher,
  Subjects,
  Streams,
  TicketUpdatedEvent,
} from '@rrpereztickets/common';

export class TicketUpdatedPublisher extends BaseNatsPublisher<TicketUpdatedEvent> {
  stream: Streams.EventStream = Streams.EventStream;
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
