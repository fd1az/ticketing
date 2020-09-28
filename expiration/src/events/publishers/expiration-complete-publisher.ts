import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from "@fdtickets/common";

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
}
