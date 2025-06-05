import { Subjects } from './subjects';
import { Event } from './nats-listener';
import { Streams } from './streams';

export interface ExpirationCompleteEvent extends Event {
  stream: Streams.EventStream;
  subject: Subjects.ExpirationComplete;
  data: {
    orderId: string;
  };
}
