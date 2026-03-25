import Stripe from 'stripe';

const config: Stripe.StripeConfig = {
  apiVersion: '2025-07-30.basil' as unknown as Stripe.LatestApiVersion,
  maxNetworkRetries: 2,
};

if (process.env.STRIPE_API_HOST) {
  config.protocol =
    (process.env.STRIPE_API_PROTOCOL as 'http' | 'https') ?? 'http';
  config.host = process.env.STRIPE_API_HOST;
  config.port = Number(process.env.STRIPE_API_PORT ?? 12111);
}

export const stripe = new Stripe(process.env.STRIPE_KEY!, config);
