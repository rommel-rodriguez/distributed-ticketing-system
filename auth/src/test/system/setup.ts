import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  var signin: () => string[];
}

beforeAll(async () => {
  process.env.JWT_KEY = process.env.JWT_KEY || 'ASDFDDSFAS';

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI not set for system tests');
  }

  await mongoose.connect(process.env.MONGO_URI);
});

beforeEach(async () => {
  jest.clearAllMocks();

  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});

global.signin = () => {
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const b64session = Buffer.from(sessionJSON).toString('base64');

  return [`session=${b64session}`];
};
