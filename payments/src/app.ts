import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { createChargeRouter } from './routes/new';
import { stripeWebhookRouter } from './routes/stripe-webhook';

import {
  currentUser,
  errorHandler,
  NotFoundError,
} from '@rrpereztickets/common';

const app = express();
const jsonParser = express.json();
app.set('trust proxy', true);
// app.use(json());
app.use((req, res, next) => {
  // Prefer req.path to ignore querystrings; handle variations if needed
  if (req.path === '/payments/stripe-webhook') return next();
  return jsonParser(req, res, next);
});
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);
app.use(createChargeRouter);
app.use(stripeWebhookRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
