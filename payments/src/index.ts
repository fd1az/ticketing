import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('FUCK - JWT_KEY');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('FUCK - MONGO_URI');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('FUCK - NATS_CLUSTER_ID');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('FUCK - NATS_CLIENT_ID');
  }

  if (!process.env.NATS_URL) {
    throw new Error('FUCK - NATS_URL');
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

start();
