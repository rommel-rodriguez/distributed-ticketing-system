import { randomBytes } from 'crypto';
import {
  connect,
  StringCodec,
  JSONCodec,
  JetStreamManager,
  AckPolicy,
} from 'nats';

// console.clear();
const NATSJS_HOST = 'localhost:4222';

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

  // NOTE: Consumer version: consume everything in the stream
  // const c = await js.consumers.get('event-stream', {
  //   name_prefix: 'listener01',
  //   filterSubjects: 'ticket:created',
  // });
  // const c = await js.consumers.get('test-stream', {
  //   name_prefix: 'listener01',
  //   filterSubjects: 'ticket:created',
  // });
  // NOTE:  This version creates a 'durable' consumer
  // generate random durable name for the consumer
  const durableWorkerName = `shadow-worker-${randomBytes(20).toString('hex')}`;
  // Creates the durable cosumer
  await jsm.consumers.add('test-stream', {
    durable_name: durableWorkerName,
    ack_policy: AckPolicy.Explicit,
    filter_subject: 'ticket:create',
  });

  const c = await js.consumers.get('test-stream', durableWorkerName);
  const messages = await c.consume();
  for await (const m of messages) {
    // console.log(m.seq);
    let payload: EventData = sc.decode(m.data) as EventData;
    console.log(
      `Title: ${payload.title},Subject: ${m.subject}, Seq: ${m.seq}, Listener: ${m.info.consumer}`
    );
    // console.log('TEST');
    // console.log(m);
    console.log(payload);
    m.ack();
  }
  // NOTE: Subscription version: Consume just the most recent, or from a work queue, just he un-acknowledged
  console.log('subscription closed');
  // const sub = nc.subscribe('tickets:created');
  // for await (const m of sub) {
  //   console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`);
  // }
  // console.log('subscription closed');
  await nc.close();
})();
