import { connect, JSONCodec, JetStreamManager, AckPolicy } from 'nats';

import { TicketCreatedListener } from './events/ticket-created-listener';

// console.clear();
const NATSJS_HOST = 'localhost:4222';
const streamName = 'test-stream';
const subjectName = 'ticket:created';

(async () => {
  // Connect to the NATS server
  const nc = await connect({ servers: `nats://${NATSJS_HOST}` });
  process.on('SIGINT', async () => await nc.close());
  process.on('SIGTERM', async () => await nc.close());

  const jsm: JetStreamManager = await nc.jetstreamManager();
  // Create a JetStream context
  const js = nc.jetstream();

  const sc = JSONCodec();

  const durableWorkerName = 'shadow-worker';
  // Creates the durable consumer
  await jsm.consumers.add(streamName, {
    durable_name: durableWorkerName,
    ack_policy: AckPolicy.Explicit,
    filter_subject: subjectName,
  });

  await new TicketCreatedListener(nc).listen();
  // // NOTE: Subscription version: Consume just the most recent, or from a work queue, just the un-acknowledged
  console.log('subscription closed');
  await nc.close();
  process.exit();
})();
