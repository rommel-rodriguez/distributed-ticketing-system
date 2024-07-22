import { randomBytes } from 'crypto';
import {
  connect,
  StringCodec,
  JSONCodec,
  JetStreamManager,
  AckPolicy,
  DeliverPolicy,
} from 'nats';

// console.clear();
const NATSJS_HOST = 'localhost:4222';
const streamName = 'test-stream';
const subjectName = 'ticket:created';
const queueName = 'ticket-created-workers';

interface EventData {
  id: string;
  title: string;
  price: number;
}

(async () => {
  // Connect to the NATS server
  const nc = await connect({ servers: `nats://${NATSJS_HOST}` });

  const jsm: JetStreamManager = await nc.jetstreamManager();
  // Create a JetStream context
  const js = nc.jetstream();

  const sc = JSONCodec();

  const messages = await nc.subscribe(subjectName, { queue: queueName });
  for await (const m of messages) {
    // console.log(m.seq);
    let payload: EventData = sc.decode(m.data) as EventData;
    console.log(`Title: ${payload.title},Subject: ${m.subject}`);
    console.log(payload);
  }
  // NOTE: Subscription version: Consume just the most recent, or from a work queue, just he un-acknowledged
  console.log('subscription closed');
  await nc.close();
})();
