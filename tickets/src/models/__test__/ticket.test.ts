import { Ticket } from '../tickets';

it('implements optimistic concurrency control', async (done) => {
  //CREATE AN INSTANCE OF A TICKET
  const ticket = Ticket.build({
    title: 'lala',
    price: 200,
    userId: '123',
  });
  //Save the ticket to the database
  await ticket.save();

  //fetch the ticket twice
  const firstIntance = await Ticket.findById(ticket.id);
  const secondIntance = await Ticket.findById(ticket.id);

  //make two separate changes to tickets we fetched
  firstIntance!.set({ price: 10 });
  secondIntance!.set({ price: 15 });

  await firstIntance!.save();
  try {
    await secondIntance!.save();
  } catch (error) {
    return done();
  }
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '123',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);



})
