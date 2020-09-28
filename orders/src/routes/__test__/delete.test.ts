import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";

it("marks and order as cancelled", async () => {
  //Create a ticket with ticket Model
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "piola",
    price: 100,
  });
  await ticket.save();
  const user = global.signin();
  // make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);
  //make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);
});

it("emits an order cancelled event", async () => {
  //Create a ticket with ticket Model
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "piola",
    price: 100,
  });
  await ticket.save();
  const user = global.signin();
  // make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);
  //make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
