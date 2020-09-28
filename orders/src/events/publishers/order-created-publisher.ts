import { Publisher, OrderCreatedEvent, Subjects } from '@fdtickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
