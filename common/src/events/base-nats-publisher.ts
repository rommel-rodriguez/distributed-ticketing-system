import { JetStreamClient, NatsConnection, JSONCodec, PubAck } from 'nats';
import { Subjects } from './subjects';
import { Streams } from './streams';

interface Event {
  stream: Streams;
  subject: Subjects;
  data: any;
}

export abstract class BaseNatsPublisher<T extends Event> {
  abstract stream: T['stream'];
  abstract subject: T['subject'];
  private client: JetStreamClient;

  constructor(connection: NatsConnection) {
    this.client = connection.jetstream();
  }

  async publish(data: T['data']) {
    const encodedMessage = this.encodeMessage(data);
    const pa: PubAck = await this.client.publish(this.subject, encodedMessage);
    console.log('Event Published');
    console.log('Publish Acknowledgement: ', pa);
  }

  encodeMessage(data: T['data']) {
    const codec = JSONCodec();
    return codec.encode(data);
  }
}
