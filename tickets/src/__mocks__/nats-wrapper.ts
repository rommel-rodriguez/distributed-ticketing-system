export const natsWrapper = {
  /**
   * For my case, this object must have a 'connection' property of type NatsConnection
   * and such an object must implement a 'jetstream' method that will
   * return a JetStreamClient object. The client object must implement the publish
   * method
   */
  connection: {
    jetstream: () => {
      return {
        publish: jest
          .fn()
          .mockImplementation((subject: any, encodedMessage: any) => {
            /** TODO: Now, here is the issue, as is, this should return a PubAck (nats)
             * object. If I want to change this, I need to modify (and reinstall where
             * pertinent) the common module.
             */
            return {
              stream: 'mock-stream',
              seq: 10,
              duplicate: false,
            };
          }),
      };
    },
  },
};
