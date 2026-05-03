import { pgTable, serial, text, timestamp, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const devicesTable = pgTable("devices", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  hostname: text("hostname").notNull(),
  type: text("type", { enum: ["workstation", "server", "network_device", "mobile"] }).notNull(),
  os: text("os").notNull(),
  osVersion: text("os_version"),
  status: text("status", { enum: ["online", "offline", "warning"] }).notNull().default("online"),
  cpuUsage: real("cpu_usage"),
  memoryUsage: real("memory_usage"),
  diskUsage: real("disk_usage"),
  ipAddress: text("ip_address"),
  lastSeen: timestamp("last_seen").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDeviceSchema = createInsertSchema(devicesTable).omit({ id: true, createdAt: true });
export type InsertDevice = z.infer<typeof insertDeviceSchema>;
export type Device = typeof devicesTable.$inferSelect;
