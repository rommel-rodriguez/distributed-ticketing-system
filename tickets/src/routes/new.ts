import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  currentUser,
  validateRequest,
} from '@rrpereztickets/common';

import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than Zero'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    // NOTE: After .save is ran, the ticket object will have its data updated with
    // values to match the values in the database.
    await ticket.save();
    // NOTE: lacking logging for the case in which saving to the database succeeds, but
    // publishing fails. What then?
    // TODO: Missing code to handle a failure while publishing. By default the publish
    // method will raise an error here if it can not save the event in NATS.
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
