import { Subjects } from './subjects';
import { Event } from './nats-listener';
import { Streams } from './streams';

export interface ExpirationComplete extends Event {
  stream: Streams.EventStream;
  subject: Subjects.TicketCreated;
  data: {
    orderId: string;
  };
}
