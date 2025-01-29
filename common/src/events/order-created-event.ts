import { Subjects } from './subjects';
import { Streams } from './streams';
import { OrderStatus } from './types/order-status';

export interface OrderCreatedEvent {
  stream: Streams.EventStream;
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    status: OrderStatus;
    userId: string;
    expiresAt: string;
    ticket: {
      id: string;
      price: number;
    };
  };
}
