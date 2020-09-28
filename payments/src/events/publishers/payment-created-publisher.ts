import { Subjects, Publisher, PaymentCreatedEvent } from '@fdtickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
