import {
  BaseNatsPublisher,
  OrderCreatedEvent,
  Subjects,
  Streams,
} from '@rrpereztickets/common';

export class OrderCreatedPublisher extends BaseNatsPublisher<OrderCreatedEvent> {
  stream: Streams.EventStream = Streams.EventStream;
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
