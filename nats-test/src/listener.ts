import nats from 'node-nats-streaming';
import { TiecketCreatedListener } from './events/ticket-created-listener';

import { randomBytes } from 'crypto';

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });
  new TiecketCreatedListener(stan).listen();
});

stan.on('SIGINT', () => stan.close());
stan.on('SIGTERM', () => stan.close());
