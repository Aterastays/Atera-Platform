import { Router } from "express";
import { db, devicesTable, customersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  ListDevicesQueryParams,
  CreateDeviceBody,
  GetDeviceParams,
  UpdateDeviceBody,
  UpdateDeviceParams,
  DeleteDeviceParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/devices", async (req, res) => {
  const query = ListDevicesQueryParams.parse({
    customerId: req.query.customerId ? Number(req.query.customerId) : undefined,
    status: req.query.status,
  });

  const conditions = [];
  if (query.customerId) conditions.push(eq(devicesTable.customerId, query.customerId));
  if (query.status) conditions.push(eq(devicesTable.status, query.status as "online" | "offline" | "warning"));

  const devices = conditions.length
    ? await db.select().from(devicesTable).where(and(...conditions))
    : await db.select().from(devicesTable);

  const customers = await db.select({ id: customersTable.id, name: customersTable.name }).from(customersTable);
  const customerMap = new Map(customers.map((c) => [c.id, c.name]));

  const result = devices.map((d) => ({
    ...d,
    customerName: customerMap.get(d.customerId) ?? null,
  }));

  res.json(result);
});

router.post("/devices", async (req, res) => {
  const body = CreateDeviceBody.parse(req.body);
  const [device] = await db.insert(devicesTable).values({ ...body, lastSeen: new Date() }).returning();

  const [customer] = await db.select({ name: customersTable.name }).from(customersTable).where(eq(customersTable.id, device.customerId));
  res.status(201).json({ ...device, customerName: customer?.name ?? null });
});

router.get("/devices/:id", async (req, res) => {
  const { id } = GetDeviceParams.parse({ id: Number(req.params.id) });
  const [device] = await db.select().from(devicesTable).where(eq(devicesTable.id, id));
  if (!device) return res.status(404).json({ error: "Device not found" });

  const [customer] = await db.select({ name: customersTable.name }).from(customersTable).where(eq(customersTable.id, device.customerId));
  res.json({ ...device, customerName: customer?.name ?? null });
});

router.put("/devices/:id", async (req, res) => {
  const { id } = UpdateDeviceParams.parse({ id: Number(req.params.id) });
  const body = UpdateDeviceBody.parse(req.body);
  const [device] = await db
    .update(devicesTable)
    .set(body)
    .where(eq(devicesTable.id, id))
    .returning();
  if (!device) return res.status(404).json({ error: "Device not found" });

  const [customer] = await db.select({ name: customersTable.name }).from(customersTable).where(eq(customersTable.id, device.customerId));
  res.json({ ...device, customerName: customer?.name ?? null });
});

router.delete("/devices/:id", async (req, res) => {
  const { id } = DeleteDeviceParams.parse({ id: Number(req.params.id) });
  await db.delete(devicesTable).where(eq(devicesTable.id, id));
  res.status(204).send();
});

export default router;
