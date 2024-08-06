import {
  connect,
  PubAck,
  JSONCodec,
  JetStreamManager,
  RetentionPolicy,
  StorageType,
  DiscardPolicy,
  NatsConnection,
} from 'nats';

const subjects = ['ticket:created'];

/**
 * Creates a persistent NATS JS stream and associates an array of subjects with it.
 * @param nc - Connection to the NATS server
 * @param subjects - The subjects to be bound to this stream
 */
const setupEventStream = async (nc: NatsConnection, subjects: string[]) => {
  // TODO: Should I setup the consumers here also?
  const streamName = 'event-stream';
  const jsm: JetStreamManager = await nc.jetstreamManager();

  const streamConfig = {
    name: streamName,
    subjects: subjects,
    storage: StorageType.File, // Use file storage
    retention: RetentionPolicy.Limits, // Use limits for retention policy
    max_age: 0, // Messages never expire
    max_msgs: -1, // No limit on the number of messages
  };
  const streamInfo = await jsm.streams.add(streamConfig);
  console.log('Stream "add" returned:\n', streamInfo);
  console.log(streamInfo);
};

const setupEventStreamWrapper = async (nc: NatsConnection) => {
  await setupEventStream(nc, subjects);
};

export { setupEventStreamWrapper };
