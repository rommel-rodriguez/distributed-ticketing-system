import { natsWrapper } from './nats-wrapper';
// import {
//   orderCreatedWorker,
//   orderCancelledWorker,
// } from './events/listeners/queue-group-name';
import { Subjects, createConsumer } from '@rrpereztickets/common';

type TypeOfNatsWrapper = typeof natsWrapper;

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

    handleNatsClose(natsWrapper);
    process.on('SIGINT', async () => await natsWrapper.connection.close());
    process.on('SIGTERM', async () => await natsWrapper.connection.close());

    await natsWrapper.setupStream();

    // await createConsumer(
    //   natsWrapper.connection,
    //   orderCreatedWorker,
    //   Subjects.OrderCreated
    // );

    // new OrderCreatedListener(natsWrapper.client).listen();

    console.log('Expiration Service ready to receive');
  } catch (err) {
    console.log(err);
  }
};

start();
