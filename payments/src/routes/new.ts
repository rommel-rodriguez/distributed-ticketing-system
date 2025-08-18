import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import {
  requireAuth,
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
  '/api/payments',
  requireAuth,
  [body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    // NOTE: I am just going to define currency here because so far I was not
    // expecting to use payment intents. But, this should come from either the request's
    // body or is information stored within the order.
    const currency = 'usd';

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for a cancelled order');
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create(
        {
          amount: order.price * 100,
          currency,
          customer: order.userId,
          automatic_payment_methods: { enabled: true },
          // TODO: Set a 'return_url' here, so that in the case the client is presented
          // with a 3ds challenge the client returns to our designated location
        },
        { idempotencyKey: req.header('Idempotency-Key') ?? undefined }
      );
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }

    res.send({ success: true });
  }
);

export { router as createChargeRouter };
