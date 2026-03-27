import '../integration/setup.compose';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  var signin: (id?: string) => string[];
}

beforeAll(() => {
  process.env.JWT_KEY = process.env.JWT_KEY || 'ASDFDDSFAS';
});

global.signin = (id?: string) => {
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const b64session = Buffer.from(sessionJSON).toString('base64');

  return [`session=${b64session}`];
};
