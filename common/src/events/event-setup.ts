import {
  JetStreamManager,
  RetentionPolicy,
  StorageType,
  NatsConnection,
  NatsError,
  AckPolicy,
} from 'nats';

import { Subjects } from './subjects';
import { Streams } from './streams';

/**
 * Finds out if the stream already exists
 * @param stream  - A stream representing the name of the stream
 * @param jsm - A JetStreamManager-type object
 * @returns  true, if the stream exists, false if it doesn't
 */
const streamAlreadyExists = async (
  stream: string,
  jsm: JetStreamManager
): Promise<boolean> => {
  let streamInfo;
  try {
    streamInfo = await jsm.streams.info(stream);
  } catch (err) {
    if (err instanceof NatsError) {
      console.log('[DEBUG] The stream ' + stream + ' does NOT exists yet.');
      return false;
    }
    // Re-throw the error if its not a NatsError (handled by our custom error middleware)
    throw err;
  }
  console.log(`[DEBUG] Does the stream ${stream} exists?\nGot:\n`);
  console.log(streamInfo);

  // if (streamInfo) return true;

  return true;
};

// TODO: Analyze whether or not it is a good design decision to leave the specification
// , or initialization, of subjects here. Maybe..
//  const subjects = ['ticket:created', 'ticket:updated'];
const subjects = [
  Subjects.TicketCreated,
  Subjects.TicketUpdated,
  Subjects.OrderCancelled,
  Subjects.OrderCreated,
];

/**
 * Creates a persistent NATS JS stream and associates an array of subjects with it.
 * @param nc - Connection to the NATS server
 * @param subjects - The subjects to be bound to this stream
 */
const setupEventStream = async (nc: NatsConnection, subjects: string[]) => {
  // TODO: Should I setup the consumers here also?
  // TODO: Decide whether or not this should be hardcoded or not.
  // It will most likely have to be hardcoded if I can not get the behavior one does
  // when creating 'consumer groups' so that the same instances of one services only
  // get the same event in one instance, but other services get the same event also.
  // const streamName = 'event-stream';
  const streamName = Streams.EventStream;
  const jsm: JetStreamManager = await nc.jetstreamManager();

  const streamExists = await streamAlreadyExists(streamName, jsm);

  if (streamExists) {
    console.log(`The stream ${streamName} already exists`);
    console.log(
      'Assuming that it is properly configured with the needed subjects'
    );
    return;
  }

  const streamConfig = {
    name: streamName,
    subjects: subjects,
    storage: StorageType.File, // Use file storage
    retention: RetentionPolicy.Limits, // Use limits for retention policy
    max_age: 0, // Messages never expire
    max_msgs: -1, // No limit on the number of messages
  };
  const streamInfo = await jsm.streams.add(streamConfig);
  // console.log('[DEBUG] Stream "add" returned:');
  console.log('Stream Added and configured. Stream configuration:\n');
  console.log(streamInfo);
};

const setupEventStreamWrapper = async (nc: NatsConnection) => {
  await setupEventStream(nc, subjects);
};

const getConsumerInfo = async (nc: NatsConnection, workerName: string) => {
  const jsm: JetStreamManager = await nc.jetstreamManager();
  let consumerInfo;
  try {
    consumerInfo = await jsm.consumers.info(Streams.EventStream, workerName);
  } catch (err) {
    if (err instanceof NatsError) {
      console.debug(`Durable Consumer ${workerName} does not exists`);
      return null;
    }
    throw err; // Rethrow the error if it is not a nats error
  }
  return consumerInfo;
};

const createConsumer = async (
  nc: NatsConnection,
  workerName: string,
  subject: string
) => {
  const jsm: JetStreamManager = await nc.jetstreamManager();
  // const durableWorkerName = 'shadow-worker';
  // Test if consumer already exists
  // Current assumption is that .info returns a falsy value if the consumer does not
  // exist
  const consumerInfo = await getConsumerInfo(nc, workerName);
  if (consumerInfo) {
    console.debug(
      `The consumer ${workerName} already exists in stream ${Streams.EventStream}`
    );
    console.debug(consumerInfo);
    return;
  }
  // Creates the durable consumer, if it does not already  exists
  await jsm.consumers.add(Streams.EventStream, {
    durable_name: workerName,
    ack_policy: AckPolicy.Explicit,
    // TODO: Add subjects parameter to this function, then check the docs on nats site.
    filter_subject: subject,
  });

  await nc.close();
};

/**
 *
 * @param nc
 * @param subject
 */
const addSubjectToNatsStream = async (
  nc: NatsConnection,
  subject: string,
  stream: Streams
) => {
  // TODO:
  // - Check NATS docs describe the process of updating a stream
  // - If not specific, first get the original subjects already in the Stream
  // - Then, test if the subject to be added is already listed
  // - If already listed, do nothing.
  // - If not listed, append it do the array and update the stream.
  const jsm: JetStreamManager = await nc.jetstreamManager();
  const streamExists = await streamAlreadyExists(stream, jsm);

  if (!streamExists) {
    console.error(`The stream ${stream} does not exist`);
    return;
  }
  console.log(`The stream ${stream} already exists`);
  console.log(`Trying to add subject ${subject}`);
  // let streamInfo;
  // try {
  //   streamInfo = await jsm.streams.info(Streams.EventStream);
  // } catch (err) {
  //   if (err instanceof NatsError) {
  //     console.debug(
  //       `Failed to retrieve the information of ${Streams.EventStream}`
  //     );
  //   }
  //   throw err;
  // }
  let updatedStreamInfo;
  try {
    updatedStreamInfo = await jsm.streams.update(Streams.EventStream, {
      subjects: [], // TODO:
    });
    console.log(
      `Stream updated, added subject${subject}:\n${updatedStreamInfo}`
    );
  } catch (err) {
    if (err instanceof NatsError) {
      console.error(
        `Failed to update the configuration of ${Streams.EventStream}`
      );
    }

    throw err;
  }
};

export { setupEventStreamWrapper, createConsumer, addSubjectToNatsStream };
