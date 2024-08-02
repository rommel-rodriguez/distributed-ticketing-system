import mongoose from 'mongoose';
import { natsWrapper } from './nats-wrapper';
import { NatsConnection } from 'nats';

import { app } from './app';

const NATSJS_HOST = 'nats-jets-svc:4222';
const natsUrl = `nats://${NATSJS_HOST}`;

type TypeOfNatsWrapper = typeof natsWrapper;

const handleNatsClose = async (natsWrapper: TypeOfNatsWrapper) => {
  const natsConnectionClosed = natsWrapper.connection.closed();
  while (true) {
    const err = await natsConnectionClosed;
    console.log(err);
  }
};

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('The private key for JWT Tokens not set');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('Mongo URI must be defined');
  }
  try {
    await natsWrapper.connect('event-client-', natsUrl);
    // NOTE: I have a problem. Here is the place in which I should place
    // the code to handle kb interrupts and to exit the app if we fail to
    // connect to nats, which is done through a callback, well, this is
    // not quite the same for the version of NATS JS I am currently using.
    // TODO: Implement code to handle interrupts and to terminate the
    // application in case we can not connect to a NATS server.
    // const natsConnectionClosed = natsWrapper.connection.closed();
    handleNatsClose(natsWrapper);
    // NOTE: natsConnectionClosed  gets resolves to a value when the connection is
    // closes, but, where do I 'await' that value? Maybe at the very end of this block?
    // because, if I put it bedore mongoose, as we are inside a the async block,
    // mongoose.connect will never run until we get something from close()!!!
    // Also, I would need this function to run to forever at least logging whatever
    // made the nats connection to be lost.
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB!!!');
  } catch (err) {
    console.log(err);
  }
};

app.listen(3000, () => {
  console.log('=> Lauschen auf Port 3000!!!');
});

start();
