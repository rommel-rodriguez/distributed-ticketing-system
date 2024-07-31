import { BaseNatsPublisher } from './base-nats-publisher';
import { Subjects } from './subjects';
import { TicketCreatedEvent } from './ticket-create-event';

export class TicketCreatedPublisher extends BaseNatsPublisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  stream = 'test-stream';
}
