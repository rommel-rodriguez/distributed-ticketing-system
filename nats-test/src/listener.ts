import {
  connect,
  JSONCodec,
  JetStreamManager,
  JetStreamClient,
  AckPolicy,
  NatsConnection,
  Codec,
  JsMsg,
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
  process.on('SIGINT', async () => await nc.close());
  process.on('SIGTERM', async () => await nc.close());

  const jsm: JetStreamManager = await nc.jetstreamManager();
  // Create a JetStream context
  const js = nc.jetstream();

  const sc = JSONCodec();

  const durableWorkerName = 'shadow-worker';
  // Creates the durable cosumer
  await jsm.consumers.add(streamName, {
    durable_name: durableWorkerName,
    ack_policy: AckPolicy.Explicit,
    filter_subject: subjectName,
  });

  await new TicketCreatedListener(nc).listen();
  // const c = await js.consumers.get(streamName, durableWorkerName);
  // const messages = await c.consume();
  // for await (const m of messages) {
  //   // console.log(m.seq);
  //   let payload: EventData = sc.decode(m.data) as EventData;
  //   console.log(
  //     `Title: ${payload.title},Subject: ${m.subject}, Seq: ${m.seq}, Listener: ${m.info.consumer}`
  //   );
  //   console.log(payload);
  //   m.ack();
  // }
  // // NOTE: Subscription version: Consume just the most recent, or from a work queue, just he un-acknowledged
  console.log('subscription closed');
  await nc.close();
  process.exit();
})();

abstract class NatsListener {
  abstract stream: string;
  abstract subject: string;
  abstract durableWorker: string;
  abstract decoder: Codec<unknown>;
  private connection: NatsConnection;
  private client: JetStreamClient;
  protected ackWait = 5 * 1000;

  constructor(connection: NatsConnection) {
    this.connection = connection;
    this.client = connection.jetstream();
  }
  async listen() {
    // NOTE: Putting the code before this.parseMessage inside the concerte method
    // "listen", makes the strong assumption that this kind of setup, or initialization,
    // process will be shared by all subclasses of NatsListener. TODO: Consider
    // modifying this code to make it more flexible, meaning, make less assumptions.
    const c = await this.client.consumers.get(this.stream, this.durableWorker);
    const messages = await c.consume();
    for await (const m of messages) {
      const decodedData = this.parseMessage(m);
      this.onMessage(decodedData, m);
    }
  }
  parseMessage(message: JsMsg): EventData {
    // NOTE: Do I need to try-catch this?
    return this.decoder.decode(message.data) as EventData;
  }

  abstract onMessage(decodedData: EventData, message: JsMsg): any;
}

class TicketCreatedListener extends NatsListener {
  stream: string = 'test-stream';
  subject: string = 'ticket:created';
  durableWorker: string = 'shadow-worker';
  decoder: Codec<unknown> = JSONCodec();

  onMessage(data: EventData, message: JsMsg) {
    console.log('Event data!', data);

    console.log(
      `Title: ${data.title},Subject: ${message.subject}, Seq: ${message.seq}, Listener: ${message.info.consumer}`
    );
    message.ack();
  }
}
