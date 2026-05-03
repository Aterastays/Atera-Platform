import { Router } from "express";
import { db, alertsTable, devicesTable, customersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  ListAlertsQueryParams,
  CreateAlertBody,
  GetAlertParams,
  UpdateAlertBody,
  UpdateAlertParams,
} from "@workspace/api-zod";

const router = Router();

async function enrichAlert(alert: typeof alertsTable.$inferSelect) {
  const [device] = await db
    .select({ hostname: devicesTable.hostname, customerId: devicesTable.customerId })
    .from(devicesTable)
    .where(eq(devicesTable.id, alert.deviceId));

  let customerName = null;
  let customerId = null;
  if (device) {
    customerId = device.customerId;
    const [customer] = await db
      .select({ name: customersTable.name })
      .from(customersTable)
      .where(eq(customersTable.id, device.customerId));
    customerName = customer?.name ?? null;
  }

  return {
    ...alert,
    deviceHostname: device?.hostname ?? null,
    customerId,
    customerName,
  };
}

router.get("/alerts", async (req, res) => {
  const query = ListAlertsQueryParams.parse({
    deviceId: req.query.deviceId ? Number(req.query.deviceId) : undefined,
    severity: req.query.severity,
    resolved: req.query.resolved !== undefined ? req.query.resolved === "true" : undefined,
  });

  const conditions = [];
  if (query.deviceId) conditions.push(eq(alertsTable.deviceId, query.deviceId));
  if (query.severity) conditions.push(eq(alertsTable.severity, query.severity as "critical" | "warning" | "info"));
  if (query.resolved !== undefined) conditions.push(eq(alertsTable.resolved, query.resolved));

  const alerts = conditions.length
    ? await db.select().from(alertsTable).where(and(...conditions))
    : await db.select().from(alertsTable);

  const devices = await db.select({ id: devicesTable.id, hostname: devicesTable.hostname, customerId: devicesTable.customerId }).from(devicesTable);
  const customers = await db.select({ id: customersTable.id, name: customersTable.name }).from(customersTable);

  const deviceMap = new Map(devices.map((d) => [d.id, d]));
  const customerMap = new Map(customers.map((c) => [c.id, c.name]));

  const result = alerts.map((a) => {
    const device = deviceMap.get(a.deviceId);
    return {
      ...a,
      deviceHostname: device?.hostname ?? null,
      customerId: device?.customerId ?? null,
      customerName: device ? (customerMap.get(device.customerId) ?? null) : null,
    };
  });

  res.json(result);
});

router.post("/alerts", async (req, res) => {
  const body = CreateAlertBody.parse(req.body);
  const [alert] = await db.insert(alertsTable).values({ ...body, resolved: false }).returning();
  const enriched = await enrichAlert(alert);
  res.status(201).json(enriched);
});

router.get("/alerts/:id", async (req, res) => {
  const { id } = GetAlertParams.parse({ id: Number(req.params.id) });
  const [alert] = await db.select().from(alertsTable).where(eq(alertsTable.id, id));
  if (!alert) return res.status(404).json({ error: "Alert not found" });
  const enriched = await enrichAlert(alert);
  res.json(enriched);
});

router.put("/alerts/:id", async (req, res) => {
  const { id } = UpdateAlertParams.parse({ id: Number(req.params.id) });
  const body = UpdateAlertBody.parse(req.body);

  const updateData: Partial<typeof alertsTable.$inferInsert> = { ...body };
  if (body.resolved === true) {
    updateData.resolvedAt = new Date();
  } else if (body.resolved === false) {
    updateData.resolvedAt = undefined;
  }

  const [alert] = await db.update(alertsTable).set(updateData).where(eq(alertsTable.id, id)).returning();
  if (!alert) return res.status(404).json({ error: "Alert not found" });
  const enriched = await enrichAlert(alert);
  res.json(enriched);
});

export default router;
