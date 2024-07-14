import { connect, StringCodec, JetStreamManager } from 'nats';

const NATSJS_HOST = 'localhost:4222';

(async () => {
  // Connect to the NATS server
  const nc = await connect({ servers: `nats://${NATSJS_HOST}` });

  // Create a JetStream manager
  const jsm: JetStreamManager = await nc.jetstreamManager();
  // Create a stream (if not already exists)
  await jsm.streams.add({ name: 'mystream', subjects: ['foo'] });

  // Create a JetStream context
  const js = nc.jetstream();

  // Create a StringCodec for encoding/decoding messages
  const sc = StringCodec();

  // Publish a message to the stream
  const pa = await js.publish('foo', sc.encode('Hello World!'));
  console.log(`Published message with sequence: ${pa.seq}`);

  await nc.close();
})();
