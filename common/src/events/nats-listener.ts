import { JetStreamClient, NatsConnection, Codec, JsMsg } from 'nats';
import { Subjects } from './subjects';
import { Streams } from './streams';

export interface EventData {
  id: string;
  title: string;
  price: number;
}

export interface Event {
  stream: Streams;
  subject: Subjects;
  data: any;
}

export abstract class NatsListener<T extends Event> {
  abstract stream: T['stream'];
  abstract subject: T['subject'];
  abstract durableWorker: string;
  abstract onMessage(decodedData: T['data'], message: JsMsg): any;
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
  parseMessage(message: JsMsg) {
    // NOTE: Do I need to try-catch this?
    return this.decoder.decode(message.data);
  }
}
