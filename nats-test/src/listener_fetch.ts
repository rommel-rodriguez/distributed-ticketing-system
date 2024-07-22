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

  const durableWorkerName = `shadow-worker-${randomBytes(4).toString('hex')}`;
  // Creates the durable consumer
  await jsm.consumers.add(streamName, {
    durable_name: durableWorkerName,
    ack_policy: AckPolicy.Explicit,
    filter_subject: subjectName,
    deliver_policy: DeliverPolicy.LastPerSubject,
  });

  const c = await js.consumers.get(streamName, durableWorkerName);
  const messages = await c.fetch();
  for await (const m of messages) {
    // console.log(m.seq);
    let payload: EventData = sc.decode(m.data) as EventData;
    console.log(
      `Title: ${payload.title},Subject: ${m.subject}, Seq: ${m.seq}, Listener: ${m.info.consumer}`
    );
    console.log(payload);
    m.ack();
  }
  // NOTE: Subscription version: Consume just the most recent, or from a work queue, just he un-acknowledged
  console.log('subscription closed');
  await nc.close();
})();
