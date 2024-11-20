export const natsWrapper = {
  /**
   * For my case, this object must have a 'connection' property of type NatsConnection
   * and such an object must implement a 'jetstream' method that will
   * return a JetStreamClient object. The client object must implement the publish
   * method
   */
  connection: {},
};
