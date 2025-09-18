import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_KEY!, {
  //apiVersion: '2025-05-28.basil',
  // apiVersion: '2025-07-30.basil',
  apiVersion: '2025-07-30.basil' as unknown as Stripe.LatestApiVersion,
});
