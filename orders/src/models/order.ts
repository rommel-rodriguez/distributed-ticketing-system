import mongoose from 'mongoose';
import { OrderStatus } from '@rrpereztickets/common';
import { TicketDoc } from './ticket';

export { OrderStatus };

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  // S: Implementing the Optimistic Concurrency solution mongoose-update-if-current offers
  version: number;
  // E: Implementing the Optimistic Concurrency solution mongoose-update-if-current offers
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      // NOTE: The following two lines are optional. But,
      // are kept there as example of how to add this restrictions
      // , and default value, to a schema should the need arise.
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },

    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      // types: mongoose.Schema.Types.UUID,
      ref: 'Ticket',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
