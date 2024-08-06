import { NatsListener, EventData } from './nats-listener';
import { JSONCodec, Codec, JsMsg } from 'nats';
import { TicketCreatedEvent } from './ticket-create-event';
import { Subjects } from './subjects';

export class TicketCreatedListener extends NatsListener<TicketCreatedEvent> {
  stream: string = 'event-stream';
  // NOTE: This is some really weird TS quirk.
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  durableWorker: string = 'shadow-worker';
  decoder: Codec<unknown> = JSONCodec();

  onMessage(data: TicketCreatedEvent['data'], message: JsMsg) {
    console.log('Event data!', data);

    console.log(
      `Title: ${data.title},Subject: ${message.subject}, Seq: ${message.seq}, Listener: ${message.info.consumer}`
    );
    message.ack();
  }
}
