import {
  Listener,
  Subjects,
  ExpirationCompleteEvent,
  OrderStatus,
} from "@fdtickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-gruop-name";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class ExpirationCompleteListener extends Listener<
  ExpirationCompleteEvent
> {
  queueGroupName = queueGroupName;
  readonly subject = Subjects.ExpirationComplete;
  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");
    console.log(order);
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
    msg.ack();
  }
}
