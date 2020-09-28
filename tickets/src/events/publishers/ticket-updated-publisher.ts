import { Publisher, Subjects, TicketUpdatedEvent } from "@fdtickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
