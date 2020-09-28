import { Publisher, Subjects, TicketCreatedEvent } from '@fdtickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
