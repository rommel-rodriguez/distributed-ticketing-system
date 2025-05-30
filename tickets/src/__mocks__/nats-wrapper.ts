export const natsWrapper = {
  client: {
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
  },

  connection: {
    jetstream: jest.fn().mockImplementation(() => {
      null;
      // return {
      //   consumers: {
      //   }
      // }
    }),
  },
};
