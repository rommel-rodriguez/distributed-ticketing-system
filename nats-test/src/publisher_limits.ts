import {
  connect,
  PubAck,
  JSONCodec,
  JetStreamManager,
  RetentionPolicy,
  StorageType,
  DiscardPolicy,
} from 'nats';

console.clear();

const NATSJS_HOST = 'localhost:4222';
const streamName = 'test-stream';
const subjectName = 'ticket:created';

(async () => {
  // Connect to the NATS server
  const nc = await connect({
    servers: `nats://${NATSJS_HOST}`,
    name: 'client02',
  });

  console.log('Publisher connected to NATS');
  console.log(nc);
  // Create a JetStream manager
  const jsm: JetStreamManager = await nc.jetstreamManager();

  // NOTE: A Stream can contain many topics.
  // Stream definition
  const streamConfig = {
    // name: 'event-stream',
    name: streamName,
    subjects: [subjectName],
    storage: StorageType.File, // Use file storage
    // retention: RetentionPolicy.Workqueue, // Use limits for retention policy
    retention: RetentionPolicy.Limits, // Use limits for retention policy
    max_age: 0, // Messages never expire
    // max_bytes: -1, // No limit on total stream size
    max_msgs: -1, // No limit on the number of messages
    // discard: DiscardPolicy.Old, // Discard old messages when the limit is reached
    // duplicates: 120000000000, // 2 minutes for duplicate tracking window
  };
  // Create a stream (if not already exists)
  // await jsm.streams.add({ name: 'mystream', subjects: ['foo'] });
  await jsm.streams.add(streamConfig);

  // Create a JetStream context
  const js = nc.jetstream();

  // Create a StringCodec for encoding/decoding messages
  const sc = JSONCodec();

  const data = { id: '123', title: 'concert', price: 20 };

  // Publish a message to the stream
  const pa: PubAck = await js.publish(subjectName, sc.encode(data)); // NOTE: Returns an Acknowledgement like object
  if (pa) {
    console.log(`Published message with sequence: ${pa.seq}`);
    console.log('Whole of PA object:');
    console.log(pa);
  }

  await nc.close();
})();
