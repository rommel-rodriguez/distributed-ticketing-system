import { Subjects } from './subjects';
import { Event } from './nats-listener';

export interface TicketCreatedEvent extends Event {
  subject: Subjects.TicketCreated;
  stream: string = 'test-stream';
  data: {
    id: string;
    title: string;
    price: number;
  };
}
