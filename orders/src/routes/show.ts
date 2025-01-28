import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@rrpereztickets/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';

const router = express.Router();
router.get(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');
    // TODO: Add a verification that orderId is a valid mongodb id.
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    res.send({});
  }
);

export { router as showOrderRouter };
