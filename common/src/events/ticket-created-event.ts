import { Subjects } from './subjects';
import { Event } from './nats-listener';
import { Streams } from './streams';

export interface TicketCreatedEvent extends Event {
  stream: Streams.EventStream;
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    userId: string;
  };
}
