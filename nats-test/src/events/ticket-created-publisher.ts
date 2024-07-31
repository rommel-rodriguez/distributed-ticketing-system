import { BaseNatsPublisher } from './base-nats-publisher';
import { Subjects } from './subjects';
import { TicketCreatedEvent } from './ticket-create-event';

export class TicketCreatedPublisher {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
