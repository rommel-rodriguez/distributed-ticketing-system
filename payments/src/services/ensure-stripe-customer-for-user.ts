import Stripe from 'stripe';
import { BadRequestError } from '@rrpereztickets/common';
import { StripeCustomer } from '../models/stripe-customer';
import { stripe } from '../stripe';

export interface EnsureStripeCustomerInput {
  userId: string;
  email?: string;
}

export interface EnsureStripeCustomerResult {
  stripeCustomerId: string;
  createdNew: boolean;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const escapeStripeSearchLiteral = (value: string) =>
  value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

const isLiveCustomer = (
  c: Stripe.Customer | Stripe.DeletedCustomer,
): c is Stripe.Customer => !('deleted' in c);

const findStripeCustomerByAppUserId = async (
  userId: string,
): Promise<Stripe.Customer | null> => {
  const query = `metadata['appUserId']:'${escapeStripeSearchLiteral(userId)}'`;
  const res = await stripe.customers.search({ query, limit: 10 });

  const matches = res.data
    .filter(isLiveCustomer)
    .filter((c) => c.metadata?.appUserId === userId)
    .sort((a, b) => b.created - a.created);

  return matches[0] ?? null;
};

const reconcileStripeCustomerMappingFromStripe = async (input: {
  userId: string;
  email?: string;
}): Promise<EnsureStripeCustomerResult | null> => {
  const existing = await StripeCustomer.findOne({ userId: input.userId })
    .select({ stripeCustomerId: 1, _id: 0 })
    .lean<{ stripeCustomerId: string }>()
    .exec();

  if (existing) {
    return { stripeCustomerId: existing.stripeCustomerId, createdNew: false };
  }

  let found: Stripe.Customer | null = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    found = await findStripeCustomerByAppUserId(input.userId);
    if (found) break;
    await sleep(250 * attempt);
  }

  if (!found) return null;

  try {
    const mapping = StripeCustomer.build({
      userId: input.userId,
      email: input.email,
      stripeCustomerId: found.id,
    });
    await mapping.save();

    return { stripeCustomerId: mapping.stripeCustomerId, createdNew: false };
  } catch (err: any) {
    if (err?.code === 11000) {
      const winner = await StripeCustomer.findOne({ userId: input.userId })
        .select({ stripeCustomerId: 1, _id: 0 })
        .lean<{ stripeCustomerId: string }>()
        .exec();

      if (winner) {
        return { stripeCustomerId: winner.stripeCustomerId, createdNew: false };
      }
    }
    throw err;
  }
};

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
      { idempotencyKey: `customer-create:${input.userId}` },
    );
    return customer.id;
  } catch (err: unknown) {
    const e = err as { type?: string; statusCode?: number };
    const type = e.type;
    const status = e.statusCode;

    if (
      type === 'StripeInvalidRequestError' ||
      status === 400 ||
      status === 402
    ) {
      throw new BadRequestError('Invalid payment customer data');
    }

    if (
      type === 'StripeAuthenticationError' ||
      status === 401 ||
      status === 403
    ) {
      throw new Error('Stripe configuration error');
    }

    if (
      type === 'StripeAPIError' ||
      type === 'StripeConnectionError' ||
      status === 429 ||
      (status !== undefined && status >= 500)
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
  const existing = await StripeCustomer.findOne({ userId })
    .select({ stripeCustomerId: 1, _id: 0 })
    .lean<{ stripeCustomerId: string }>()
    .exec();

  if (existing) {
    return { stripeCustomerId: existing.stripeCustomerId, createdNew: false };
  }

  // Reconcile first in case Stripe write previously succeeded but DB write failed.
  const reconciled = await reconcileStripeCustomerMappingFromStripe({
    userId,
    email,
  });
  if (reconciled) return reconciled;

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
      const winner = await StripeCustomer.findOne({ userId })
        .select({ stripeCustomerId: 1, _id: 0 })
        .lean<{ stripeCustomerId: string }>()
        .exec();

      if (winner) {
        return { stripeCustomerId: winner.stripeCustomerId, createdNew: false };
      }
    }

    // Optional: attempt one last reconcile before failing hard
    const reconciledAfterFailure =
      await reconcileStripeCustomerMappingFromStripe({
        userId,
        email,
      });
    if (reconciledAfterFailure) return reconciledAfterFailure;

    throw err;
  }
};
