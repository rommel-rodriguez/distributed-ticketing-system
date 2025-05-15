import mongoose from 'mongoose';
import { natsWrapper } from './nats-wrapper';

import { app } from './app';

type TypeOfNatsWrapper = typeof natsWrapper;

// const handleNatsClose = async (natsWrapper: TypeOfNatsWrapper) => {
//   let natsConnectionClosed;
//   try {
//     natsConnectionClosed = await natsWrapper.connection.closed();
//   } catch (error) {
//     console.log('Inside NATS Connection Closed Handler');
//     console.log('Something went wrong while trying to access the connection');
//     console.log(error);
//     process.exit();
//   }
//   while (true) {
//     const err = await natsConnectionClosed;
//     console.log('Connection to NATS Server closed!!!');
//     console.log(err);
//     process.exit();
//   }
// };
const handleNatsClose = async (natsWrapper: TypeOfNatsWrapper) => {
  console.log('Inside NATS Connection Closed Handler');
  try {
    const err = await natsWrapper.connection.closed();
    console.log('Connection to NATS Server closed!!!');
    if (err) {
      console.log('The reason for the connection closure is:', err);
    }
    // Error 11 connection to NATS closed
    process.exit(11);
  } catch (error) {
    console.error('Error while handling NATS connection closure:', error);

    console.log(error);
    process.exit(11);
  }
};

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('The private key for JWT Tokens not set');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('Mongo URI must be defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }
  try {
    await natsWrapper.connect(process.env.NATS_CLIENT_ID, process.env.NATS_URL);
    // NOTE: I have a problem. Here is the place in which I should place
    // the code to handle kb interrupts and to exit the app if we fail to
    // connect to nats, which is done through a callback, well, this is
    // not quite the same for the version of NATS JS I am currently using.
    // TODO: Implement code to handle interrupts and to terminate the
    // application in case we can not connect to a NATS server.
    // const natsConnectionClosed = natsWrapper.connection.closed();
    // TODO: With this flow, handleNatsClose assumes that a connection
    // will be stablished prior to execution. However, if NATS fails
    // to start by the next time the tickets server restarts (through k8s)
    // then we get an error, due to wanting to access a connection that
    // was never started in the first place.
    handleNatsClose(natsWrapper);
    process.on('SIGINT', async () => await natsWrapper.connection.close());
    process.on('SIGTERM', async () => await natsWrapper.connection.close());
    // NOTE: natsConnectionClosed  gets resolves to a value when the connection is
    // closes, but, where do I 'await' that value? Maybe at the very end of this block?
    // because, if I put it bedore mongoose, as we are inside a the async block,
    // mongoose.connect will never run until we get something from close()!!!
    // Also, I would need this function to run to forever at least logging whatever
    // made the nats connection to be lost.
    await natsWrapper.setupStream();
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
