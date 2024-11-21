import {
  JetStreamManager,
  RetentionPolicy,
  StorageType,
  NatsConnection,
  NatsError,
} from 'nats';

import { Subjects } from './subjects';

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
const subjects = [Subjects.TicketCreated, Subjects.TicketUpdated];

/**
 * Creates a persistent NATS JS stream and associates an array of subjects with it.
 * @param nc - Connection to the NATS server
 * @param subjects - The subjects to be bound to this stream
 */
const setupEventStream = async (nc: NatsConnection, subjects: string[]) => {
  // TODO: Should I setup the consumers here also?
  const streamName = 'event-stream';
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

export { setupEventStreamWrapper };
