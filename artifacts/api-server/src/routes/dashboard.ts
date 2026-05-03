import { Router } from "express";
import { db, customersTable, devicesTable, alertsTable, ticketsTable } from "@workspace/db";
import { eq, count, and, gte } from "drizzle-orm";

const router = Router();

router.get("/dashboard/summary", async (req, res) => {
  const [totalCustomers] = await db.select({ cnt: count() }).from(customersTable);
  const [totalDevices] = await db.select({ cnt: count() }).from(devicesTable);
  const [onlineDevices] = await db.select({ cnt: count() }).from(devicesTable).where(eq(devicesTable.status, "online"));
  const [offlineDevices] = await db.select({ cnt: count() }).from(devicesTable).where(eq(devicesTable.status, "offline"));
  const [warningDevices] = await db.select({ cnt: count() }).from(devicesTable).where(eq(devicesTable.status, "warning"));
  const [openAlerts] = await db.select({ cnt: count() }).from(alertsTable).where(eq(alertsTable.resolved, false));
  const [criticalAlerts] = await db.select({ cnt: count() }).from(alertsTable).where(and(eq(alertsTable.severity, "critical"), eq(alertsTable.resolved, false)));
  const [openTickets] = await db.select({ cnt: count() }).from(ticketsTable).where(eq(ticketsTable.status, "open"));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [resolvedToday] = await db
    .select({ cnt: count() })
    .from(ticketsTable)
    .where(and(eq(ticketsTable.status, "resolved"), gte(ticketsTable.updatedAt, today)));

  res.json({
    totalCustomers: Number(totalCustomers?.cnt ?? 0),
    totalDevices: Number(totalDevices?.cnt ?? 0),
    onlineDevices: Number(onlineDevices?.cnt ?? 0),
    offlineDevices: Number(offlineDevices?.cnt ?? 0),
    warningDevices: Number(warningDevices?.cnt ?? 0),
    openAlerts: Number(openAlerts?.cnt ?? 0),
    criticalAlerts: Number(criticalAlerts?.cnt ?? 0),
    openTickets: Number(openTickets?.cnt ?? 0),
    resolvedTicketsToday: Number(resolvedToday?.cnt ?? 0),
  });
});

router.get("/dashboard/recent-alerts", async (req, res) => {
  const alerts = await db
    .select()
    .from(alertsTable)
    .where(eq(alertsTable.resolved, false))
    .orderBy(alertsTable.createdAt)
    .limit(10);

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

router.get("/dashboard/device-health", async (req, res) => {
  const [online] = await db.select({ cnt: count() }).from(devicesTable).where(eq(devicesTable.status, "online"));
  const [offline] = await db.select({ cnt: count() }).from(devicesTable).where(eq(devicesTable.status, "offline"));
  const [warning] = await db.select({ cnt: count() }).from(devicesTable).where(eq(devicesTable.status, "warning"));

  res.json({
    online: Number(online?.cnt ?? 0),
    offline: Number(offline?.cnt ?? 0),
    warning: Number(warning?.cnt ?? 0),
  });
});

router.get("/dashboard/ticket-stats", async (req, res) => {
  const [open] = await db.select({ cnt: count() }).from(ticketsTable).where(eq(ticketsTable.status, "open"));
  const [in_progress] = await db.select({ cnt: count() }).from(ticketsTable).where(eq(ticketsTable.status, "in_progress"));
  const [resolved] = await db.select({ cnt: count() }).from(ticketsTable).where(eq(ticketsTable.status, "resolved"));
  const [closed] = await db.select({ cnt: count() }).from(ticketsTable).where(eq(ticketsTable.status, "closed"));

  const [low] = await db.select({ cnt: count() }).from(ticketsTable).where(eq(ticketsTable.priority, "low"));
  const [medium] = await db.select({ cnt: count() }).from(ticketsTable).where(eq(ticketsTable.priority, "medium"));
  const [high] = await db.select({ cnt: count() }).from(ticketsTable).where(eq(ticketsTable.priority, "high"));
  const [critical] = await db.select({ cnt: count() }).from(ticketsTable).where(eq(ticketsTable.priority, "critical"));

  res.json({
    byStatus: {
      open: Number(open?.cnt ?? 0),
      in_progress: Number(in_progress?.cnt ?? 0),
      resolved: Number(resolved?.cnt ?? 0),
      closed: Number(closed?.cnt ?? 0),
    },
    byPriority: {
      low: Number(low?.cnt ?? 0),
      medium: Number(medium?.cnt ?? 0),
      high: Number(high?.cnt ?? 0),
      critical: Number(critical?.cnt ?? 0),
    },
  });
});

export default router;
