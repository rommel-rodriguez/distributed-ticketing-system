import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import bodyParser from 'body-parser'

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
  [],
  validateRequest,
  async (req: Request, res: Response) => {}
);


  // Stripe needs the raw body to verify signatures
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
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
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        // ✅ Fulfill order tied to pi.id
        break;
      }
      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        // ❌ Notify user / log failure
        break;
      }
      // Handle other events you care about
      default:
        break;
    }

    res.json({ received: true });
