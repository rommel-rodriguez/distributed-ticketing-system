import mongoose from 'mongoose';

import { app } from './app';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('The private key for JWT Tokens not set');
  }
  try {
    await mongoose.connect('mongodb://auth-mongo-svc:27017/auth');
    console.log('Connected to MongoDB!!!');
  } catch (err) {
    console.log(err);
  }
};

app.listen(3000, () => {
  console.log('=> Lauschen auf Port 3000!!!');
});

start();
