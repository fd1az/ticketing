import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { app } from '../app';

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[];
    }
  }
}

jest.mock('../nats-wrapper');

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

process.env.STRIPE_KEY = 'sk_test_2jJsiEzrYsMW4ccpFiQpef56';

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // Build a JWT payload {id, email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  //Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  //Build session Objet{jwt: MY_JWT}
  const session = { jwt: token };
  //Turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  //Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  //return the string thats the Cookie with the encoded data
  return [`express:sess=${base64}`];
};
