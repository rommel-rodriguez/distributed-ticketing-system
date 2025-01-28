import {
  BaseNatsPublisher,
  OrderCancelledEvent,
  Subjects,
  Streams,
} from '@rrpereztickets/common';

export class OrderCancelledPublisher extends BaseNatsPublisher<OrderCancelledEvent> {
  stream: Streams.EventStream = Streams.EventStream;
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
