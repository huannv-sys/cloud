import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const routers = pgTable("routers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  model: text("model"),
  ipAddress: text("ip_address"),
  macAddress: text("mac_address"),
  connectionString: text("connection_string"),
  online: boolean("online").default(false),
  firmware: text("firmware"),
  cpuUsage: integer("cpu_usage"),
  ramUsage: integer("ram_usage"),
  diskUsage: integer("disk_usage"),
  lastSeen: timestamp("last_seen"),
  tags: text("tags").array(),
  location: text("location"),
  notes: text("notes"),
  modelImagePath: text("model_image_path"),
  modelDataPath: text("model_data_path"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const backups = pgTable("backups", {
  id: serial("id").primaryKey(),
  routerId: integer("router_id").notNull(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  size: integer("size"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  active: boolean("active").default(true),
  routerId: integer("router_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  color: text("color"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const commands = pgTable("commands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  command: text("command").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const firmwareHistory = pgTable("firmware_history", {
  id: serial("id").primaryKey(),
  routerId: integer("router_id").notNull(),
  previousVersion: text("previous_version"),
  newVersion: text("new_version"),
  updatedAt: timestamp("updated_at").defaultNow(),
  status: text("status"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  isAdmin: true,
});

export const insertRouterSchema = createInsertSchema(routers).pick({
  name: true,
  model: true,
  ipAddress: true,
  macAddress: true,
  connectionString: true,
  online: true,
  firmware: true,
  cpuUsage: true,
  ramUsage: true,
  diskUsage: true,
  tags: true,
  location: true,
  notes: true,
  modelImagePath: true,
  modelDataPath: true,
});

export const insertBackupSchema = createInsertSchema(backups).pick({
  routerId: true,
  name: true,
  content: true,
  size: true,
});

export const insertSubscriberSchema = createInsertSchema(subscribers).pick({
  email: true,
  active: true,
  routerId: true,
});

export const insertTagSchema = createInsertSchema(tags).pick({
  name: true,
  color: true,
});

export const insertCommandSchema = createInsertSchema(commands).pick({
  name: true,
  command: true,
  description: true,
});

export const insertFirmwareHistorySchema = createInsertSchema(firmwareHistory).pick({
  routerId: true,
  previousVersion: true,
  newVersion: true,
  status: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertRouter = z.infer<typeof insertRouterSchema>;
export type Router = typeof routers.$inferSelect;

export type InsertBackup = z.infer<typeof insertBackupSchema>;
export type Backup = typeof backups.$inferSelect;

export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type Subscriber = typeof subscribers.$inferSelect;

export type InsertTag = z.infer<typeof insertTagSchema>;
export type Tag = typeof tags.$inferSelect;

export type InsertCommand = z.infer<typeof insertCommandSchema>;
export type Command = typeof commands.$inferSelect;

export type InsertFirmwareHistory = z.infer<typeof insertFirmwareHistorySchema>;
export type FirmwareHistory = typeof firmwareHistory.$inferSelect;
