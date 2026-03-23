import mongoose from 'mongoose';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function waitForStripeMock() {
  const protocol = process.env.STRIPE_API_PROTOCOL ?? 'http';
  const host = process.env.STRIPE_API_HOST ?? 'localhost';
  const port = process.env.STRIPE_API_PORT ?? '12111';

  const url = `${protocol}://${host}:${port}/v1/charges`;

  for (let i = 0; i < 30; i++) {
    try {
      // Any HTTP response means container is reachable; 4xx is fine here
      await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'amount=100&currency=usd',
      });
      return;
    } catch {
      await wait(500);
    }
  }

  throw new Error('stripe-mock did not become reachable in time');
}

beforeAll(async () => {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI not set');
  await waitForStripeMock();
  await mongoose.connect(process.env.MONGO_URI);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  await Promise.all(collections.map((c) => c.deleteMany({})));
});

afterAll(async () => {
  await mongoose.disconnect();
});
