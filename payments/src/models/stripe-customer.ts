import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface StripeCustomerAttrs {
  userId: string;
  stripeCustomerId: string; // cus_...
  email?: string;
}

interface StripeCustomerDoc extends mongoose.Document {
  userId: string;
  stripeCustomerId: string;
  email?: string;
  version: number;
}

interface StripeCustomerModel extends mongoose.Model<StripeCustomerDoc> {
  build(attrs: StripeCustomerAttrs): StripeCustomerDoc;
}

const stripeCustomerSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    stripeCustomerId: { type: String, required: true },
    email: { type: String, required: false },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

stripeCustomerSchema.set('versionKey', 'version');
stripeCustomerSchema.plugin(updateIfCurrentPlugin);

// One Stripe customer per app user in this service
stripeCustomerSchema.index({ userId: 1 }, { unique: true });
stripeCustomerSchema.index({ stripeCustomerId: 1 }, { unique: true });

stripeCustomerSchema.statics.build = (attrs: StripeCustomerAttrs) => {
  return new StripeCustomer(attrs);
};

const StripeCustomer = mongoose.model<StripeCustomerDoc, StripeCustomerModel>(
  'StripeCustomer',
  stripeCustomerSchema,
);

export { StripeCustomer };
