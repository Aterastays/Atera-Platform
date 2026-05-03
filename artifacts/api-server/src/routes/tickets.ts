import { Router } from "express";
import { db, ticketsTable, customersTable, devicesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  ListTicketsQueryParams,
  CreateTicketBody,
  GetTicketParams,
  UpdateTicketBody,
  UpdateTicketParams,
  DeleteTicketParams,
} from "@workspace/api-zod";

const router = Router();

async function enrichTicket(ticket: typeof ticketsTable.$inferSelect) {
  const [customer] = await db
    .select({ name: customersTable.name })
    .from(customersTable)
    .where(eq(customersTable.id, ticket.customerId));

  let deviceHostname = null;
  if (ticket.deviceId) {
    const [device] = await db
      .select({ hostname: devicesTable.hostname })
      .from(devicesTable)
      .where(eq(devicesTable.id, ticket.deviceId));
    deviceHostname = device?.hostname ?? null;
  }

  return {
    ...ticket,
    customerName: customer?.name ?? null,
    deviceHostname,
  };
}

router.get("/tickets", async (req, res) => {
  const query = ListTicketsQueryParams.parse({
    customerId: req.query.customerId ? Number(req.query.customerId) : undefined,
    status: req.query.status,
    priority: req.query.priority,
  });

  const conditions = [];
  if (query.customerId) conditions.push(eq(ticketsTable.customerId, query.customerId));
  if (query.status) conditions.push(eq(ticketsTable.status, query.status as "open" | "in_progress" | "resolved" | "closed"));
  if (query.priority) conditions.push(eq(ticketsTable.priority, query.priority as "low" | "medium" | "high" | "critical"));

  const tickets = conditions.length
    ? await db.select().from(ticketsTable).where(and(...conditions))
    : await db.select().from(ticketsTable);

  const customers = await db.select({ id: customersTable.id, name: customersTable.name }).from(customersTable);
  const devices = await db.select({ id: devicesTable.id, hostname: devicesTable.hostname }).from(devicesTable);

  const customerMap = new Map(customers.map((c) => [c.id, c.name]));
  const deviceMap = new Map(devices.map((d) => [d.id, d.hostname]));

  const result = tickets.map((t) => ({
    ...t,
    customerName: customerMap.get(t.customerId) ?? null,
    deviceHostname: t.deviceId ? (deviceMap.get(t.deviceId) ?? null) : null,
  }));

  res.json(result);
});

router.post("/tickets", async (req, res) => {
  const body = CreateTicketBody.parse(req.body);
  const now = new Date();
  const [ticket] = await db.insert(ticketsTable).values({ ...body, createdAt: now, updatedAt: now }).returning();
  const enriched = await enrichTicket(ticket);
  res.status(201).json(enriched);
});

router.get("/tickets/:id", async (req, res) => {
  const { id } = GetTicketParams.parse({ id: Number(req.params.id) });
  const [ticket] = await db.select().from(ticketsTable).where(eq(ticketsTable.id, id));
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  const enriched = await enrichTicket(ticket);
  res.json(enriched);
});

router.put("/tickets/:id", async (req, res) => {
  const { id } = UpdateTicketParams.parse({ id: Number(req.params.id) });
  const body = UpdateTicketBody.parse(req.body);
  const [ticket] = await db
    .update(ticketsTable)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(ticketsTable.id, id))
    .returning();
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  const enriched = await enrichTicket(ticket);
  res.json(enriched);
});

router.delete("/tickets/:id", async (req, res) => {
  const { id } = DeleteTicketParams.parse({ id: Number(req.params.id) });
  await db.delete(ticketsTable).where(eq(ticketsTable.id, id));
  res.status(204).send();
});

export default router;
