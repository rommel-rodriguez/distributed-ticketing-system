import { connect, StringCodec, JetStreamManager } from 'nats';

const NATSJS_HOST = 'localhost:4222';

(async () => {
  // Connect to the NATS server
  const nc = await connect({ servers: `nats://${NATSJS_HOST}` });

  // Create a JetStream context
  const js = nc.jetstream();

  // Create a StringCodec for encoding/decoding messages
  const sc = StringCodec();

  // Subscribe to the stream and receive messages
  const sub = nc.subscribe('replace-topic-here');
  for await (const m of sub) {
    console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`);
  }
  console.log('subscription closed');
  await nc.close();
})();
