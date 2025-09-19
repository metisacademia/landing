import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const preRegistrations = pgTable("pre_registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  email: text("email").notNull(),
  telefone: text("telefone").notNull(),
  cpf: text("cpf").notNull(),
  idade: integer("idade").notNull(),
  plano: text("plano").notNull(),
  horario: text("horario"),
  diaPreferencia: text("dia_preferencia"),
  observacoes: text("observacoes"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  asaasCustomerId: text("asaas_customer_id"),
  asaasPaymentId: text("asaas_payment_id"),
  paymentMethod: text("payment_method"), // PIX, BOLETO, CREDIT_CARD
  paymentStatus: text("payment_status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPreRegistrationSchema = createInsertSchema(preRegistrations).omit({
  id: true,
  asaasCustomerId: true,
  asaasPaymentId: true,
  paymentStatus: true,
  createdAt: true,
}).extend({
  cpf: z.string().min(11, "CPF deve ter 11 dígitos").max(14, "CPF inválido"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type PreRegistration = typeof preRegistrations.$inferSelect;
export type InsertPreRegistration = z.infer<typeof insertPreRegistrationSchema>;
