import {
  connect,
  StringCodec,
  JetStreamManager,
  RetentionPolicy,
  StorageType,
  DiscardPolicy,
} from 'nats';

const NATSJS_HOST = 'localhost:4222';

(async () => {
  // Connect to the NATS server
  const nc = await connect({ servers: `nats://${NATSJS_HOST}` });

  console.log('Publisher connected to NATS');
  console.log(nc);
  // Create a JetStream manager
  const jsm: JetStreamManager = await nc.jetstreamManager();

  // NOTE: A Stream can contain many topics.
  // Stream definition
  const streamConfig = {
    name: 'mystream',
    subjects: ['foo'],
    storage: StorageType.File, // Use file storage
    retention: RetentionPolicy.Limits, // Use limits for retention policy
    max_age: 0, // Messages never expire
    max_bytes: -1, // No limit on total stream size
    max_msgs: -1, // No limit on the number of messages
    discard: DiscardPolicy.Old, // Discard old messages when the limit is reached
    duplicates: 120000000000, // 2 minutes for duplicate tracking window
  };
  // Create a stream (if not already exists)
  // await jsm.streams.add({ name: 'mystream', subjects: ['foo'] });
  await jsm.streams.add(streamConfig);

  // Create a JetStream context
  const js = nc.jetstream();

  // Create a StringCodec for encoding/decoding messages
  const sc = StringCodec();

  // Publish a message to the stream
  const pa = await js.publish('foo', sc.encode('Hello World!'));
  console.log(`Published message with sequence: ${pa.seq}`);

  await nc.close();
})();
