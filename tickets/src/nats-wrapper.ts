import { NatsConnection, connect } from 'nats';
import { randomBytes } from 'crypto';

const NATSJS_HOST = 'localhost:4222';

class NatsWrapper {
  private _connection?: NatsConnection;

  get connection() {
    if (!this._connection) {
      throw new Error('Cannot access NATS client before connecting');
    }
    return this._connection;
  }

  async connect(clientId: string, url: string) {
    try {
      this._connection = await connect({
        // servers: `nats://${url}`,
        servers: url,
        // name: `events-client-${randomBytes(3).toString('hex')}`,
        name: clientId,
      });
      console.log('Successfully connected to NATS server');
    } catch (error) {
      console.log('Error while connecting to NATS server');
      console.log(error);
    }
  }
}

export const natsWrapper = new NatsWrapper();
