import { Router } from "express";
import { db, customersTable, devicesTable, ticketsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import {
  CreateCustomerBody,
  GetCustomerParams,
  UpdateCustomerBody,
  UpdateCustomerParams,
  DeleteCustomerParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/customers", async (req, res) => {
  const customers = await db.select().from(customersTable);

  const deviceCounts = await db
    .select({ customerId: devicesTable.customerId, cnt: count() })
    .from(devicesTable)
    .groupBy(devicesTable.customerId);

  const ticketCounts = await db
    .select({ customerId: ticketsTable.customerId, cnt: count() })
    .from(ticketsTable)
    .where(eq(ticketsTable.status, "open"))
    .groupBy(ticketsTable.customerId);

  const deviceMap = new Map(deviceCounts.map((d) => [d.customerId, Number(d.cnt)]));
  const ticketMap = new Map(ticketCounts.map((t) => [t.customerId, Number(t.cnt)]));

  const result = customers.map((c) => ({
    ...c,
    deviceCount: deviceMap.get(c.id) ?? 0,
    openTickets: ticketMap.get(c.id) ?? 0,
  }));

  res.json(result);
});

router.post("/customers", async (req, res) => {
  const body = CreateCustomerBody.parse(req.body);
  const [customer] = await db.insert(customersTable).values(body).returning();
  res.status(201).json({ ...customer, deviceCount: 0, openTickets: 0 });
});

router.get("/customers/:id", async (req, res) => {
  const { id } = GetCustomerParams.parse({ id: Number(req.params.id) });
  const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, id));
  if (!customer) return res.status(404).json({ error: "Customer not found" });

  const [deviceCountRow] = await db
    .select({ cnt: count() })
    .from(devicesTable)
    .where(eq(devicesTable.customerId, id));
  const [ticketCountRow] = await db
    .select({ cnt: count() })
    .from(ticketsTable)
    .where(eq(ticketsTable.customerId, id))
    .where(eq(ticketsTable.status, "open"));

  res.json({
    ...customer,
    deviceCount: Number(deviceCountRow?.cnt ?? 0),
    openTickets: Number(ticketCountRow?.cnt ?? 0),
  });
});

router.put("/customers/:id", async (req, res) => {
  const { id } = UpdateCustomerParams.parse({ id: Number(req.params.id) });
  const body = UpdateCustomerBody.parse(req.body);
  const [customer] = await db
    .update(customersTable)
    .set(body)
    .where(eq(customersTable.id, id))
    .returning();
  if (!customer) return res.status(404).json({ error: "Customer not found" });

  const [deviceCountRow] = await db
    .select({ cnt: count() })
    .from(devicesTable)
    .where(eq(devicesTable.customerId, id));
  const [ticketCountRow] = await db
    .select({ cnt: count() })
    .from(ticketsTable)
    .where(eq(ticketsTable.customerId, id))
    .where(eq(ticketsTable.status, "open"));

  res.json({
    ...customer,
    deviceCount: Number(deviceCountRow?.cnt ?? 0),
    openTickets: Number(ticketCountRow?.cnt ?? 0),
  });
});

router.delete("/customers/:id", async (req, res) => {
  const { id } = DeleteCustomerParams.parse({ id: Number(req.params.id) });
  await db.delete(customersTable).where(eq(customersTable.id, id));
  res.status(204).send();
});

export default router;
