import { stripe } from '../stripe';
import { StripeCustomer } from '../models/stripe-customer';
import { BadRequestError } from '@rrpereztickets/common';

export interface EnsureStripeCustomerInput {
  userId: string;
  email?: string;
}

export interface EnsureStripeCustomerResult {
  stripeCustomerId: string;
  createdNew: boolean;
}

const createStripeCustomer = async (input: {
  userId: string;
  email?: string;
}): Promise<string> => {
  try {
    const customer = await stripe.customers.create(
      {
        email: input.email,
        metadata: { appUserId: input.userId },
      },
      // Helps retries; still keep DB unique index for race protection
      { idempotencyKey: `customer-create:${input.userId}` },
    );
    return customer.id;
  } catch (err: any) {
    const type = err?.type; // e.g. StripeInvalidRequestError, StripeAPIError
    const status = err?.statusCode; // HTTP-like status from Stripe

    // Client/input issues -> 4xx in your API
    if (
      type === 'StripeInvalidRequestError' ||
      status === 400 ||
      status === 402
    ) {
      throw new BadRequestError('Invalid payment customer data');
    }

    // Misconfiguration -> internal/server alert
    if (
      type === 'StripeAuthenticationError' ||
      status === 401 ||
      status === 403
    ) {
      throw new Error('Stripe configuration error');
    }

    // Transient upstream issues -> 503 (optionally retried)
    if (
      type === 'StripeAPIError' ||
      type === 'StripeConnectionError' ||
      status === 429 ||
      status >= 500
    ) {
      throw new Error('Payment provider temporarily unavailable');
    }

    throw err;
  }
};

export const ensureStripeCustomerForUser = async ({
  userId,
  email,
}: EnsureStripeCustomerInput): Promise<EnsureStripeCustomerResult> => {
  const existing = await StripeCustomer.findOne({ userId });
  if (existing) {
    return { stripeCustomerId: existing.stripeCustomerId, createdNew: false };
  }

  const customerId = await createStripeCustomer({ userId, email });

  try {
    const mapping = StripeCustomer.build({
      userId,
      email,
      stripeCustomerId: customerId,
    });
    await mapping.save();

    return { stripeCustomerId: mapping.stripeCustomerId, createdNew: true };
  } catch (err: any) {
    if (err?.code === 11000) {
      const winner = await StripeCustomer.findOne({ userId });
      if (winner) {
        return { stripeCustomerId: winner.stripeCustomerId, createdNew: false };
      }
    }
    throw err;
  }
};
