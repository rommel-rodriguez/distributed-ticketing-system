import {
  BaseNatsPublisher,
  Subjects,
  Streams,
  ExpirationCompleteEvent,
} from '@rrpereztickets/common';

export class ExpirationCompletePublisher extends BaseNatsPublisher<ExpirationCompleteEvent> {
  stream: Streams.EventStream = Streams.EventStream;
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
