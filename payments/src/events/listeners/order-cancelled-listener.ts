import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from '@fdtickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/orders';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    console.log(data);
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    console.log(order);
    if (!order) {
      throw new Error('Order Not Found!');
    }
    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    msg.ack();
  }
}
