import express, { Request, Response } from 'express';
import { Stripe } from 'stripe';
import { body } from 'express-validator';
import bodyParser from 'body-parser';

import {
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@rrpereztickets/common';

import { stripe } from '../stripe';

import { Order } from '../models/order';

const router = express.Router();

router.post(
  '/api/payments/stripe-webhook',
  express.raw({ type: 'application/json' }),
  [],
  validateRequest,
  async (req: Request, res: Response) => {
    //TODO: Have to emit some events from this handler, at the very least
    // events like PaymentConfirmed and PaymentFailed, or even PaymentRequiresFurther
    // action in cases like SCA and 3-D secure.
    console.log('Request Received in stripe-webhook');
    console.log(req);

    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent;
        // ✅ Fulfill order tied to pi.id
        break;
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent;
        // ❌ Notify user / log failure
        break;
      }
      // Handle other events you care about
      default:
        break;
    }

    res.json({ received: true });
  }
);

export { router as stripeWebhookRouter };
