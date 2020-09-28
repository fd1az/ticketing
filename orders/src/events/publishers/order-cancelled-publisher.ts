import { Publisher, OrderCancelledEvent, Subjects } from '@fdtickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
