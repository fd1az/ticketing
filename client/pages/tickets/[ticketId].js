import Router from "next/router";
import React from "react";
import useRuequest from "../../hooks/use-request";
const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRuequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push("/orders/[orderId]", `/orders/${order.id}`),
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errors}
      <button className="btn btn-dark" onClick={() => doRequest()}>
        Purchase
      </button>
    </div>
  );
};

TicketShow.getInitialProps = async (contex, client) => {
  const { ticketId } = contex.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;
