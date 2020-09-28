import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";

it("fetches the order", async () => {
  //Create order
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "piola",
    price: 100,
  });
  await ticket.save();

  const user = global.signin();
  //make request to build an order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  //make request to fetch the order
  const { body: fetchOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchOrder.id).toEqual(order.id);
});

it("returns an error if one user tries to fetch another user order", async () => {
  //Create order
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "piola",
    price: 100,
  });
  await ticket.save();

  const user = global.signin();
  const userTwo = global.signin();
  //make request to build an order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  //make request to fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", userTwo)
    .send()
    .expect(401);
});
