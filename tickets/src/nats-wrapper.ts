import { NatsConnection, connect } from 'nats';
import { setupEventStreamWrapper } from '@rrpereztickets/common';

const NATSJS_HOST = 'localhost:4222';

class NatsWrapper {
  private _connection?: NatsConnection;

  /**
   * NOTE: Let it be noted, that wih my current implementation, I am no passing a
   * nats client object but a nats connection type object. So, for each call tot he
   * publish method in a publisher, a new client object will be created. This might
   * not be a problem for a test project, but further compare the overhead of doing this
   * versus instantiating a client and passing that around instead of a raw connection.
   */
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
        timeout: 500,
      });
      console.log('Successfully connected to NATS server');
    } catch (error) {
      console.log('Error while connecting to NATS server');
      console.log(error);
    }
  }

  async setupStream() {
    if (!this._connection) {
      throw new Error('Cannot setup stream before connecting to NATS');
    }
    await setupEventStreamWrapper(this._connection);
  }
}

export const natsWrapper = new NatsWrapper();
