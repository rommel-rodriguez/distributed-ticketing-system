import { connect, StringCodec, JetStreamManager } from 'nats';

const NATSJS_HOST = 'localhost:4222';

(async () => {
  // Connect to the NATS server
  const nc = await connect({ servers: `nats://${NATSJS_HOST}` });

  // Create a JetStream context
  const js = nc.jetstream();

  // js.consumers.get('foo')

  // Create a StringCodec for encoding/decoding messages
  const sc = StringCodec();
  // TODO: Retrieve all previous messages in the topic
  // console.log('Streaming messages: ');
  // // Subscribe to the stream and receive messages
  // const sub = nc.subscribe('foo');
  // for await (const m of sub) {
  //   console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`);

  // }
  const c = await js.consumers.get('mystream');
  const messages = await c.consume();
  for await (const m of messages) {
    // console.log(m.seq);
    console.log(sc.decode(m.data));
    m.ack();
  }
  console.log('subscription closed');
  await nc.close();
})();
