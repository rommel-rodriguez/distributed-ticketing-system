import { Subjects } from './subjects';
import { Streams } from './streams';
import { Event } from './nats-listener';

export interface TicketUpdatedEvent extends Event {
  stream: Streams.EventStream;
  subject: Subjects.TicketUpdated;
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    userId: string;
  };
}
