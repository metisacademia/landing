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
  // Endereço - Obrigatórios para nota fiscal
  postalCode: text("postal_code").notNull(),
  addressNumber: text("address_number").notNull(), 
  // Endereço - Opcionais (preenchidos automaticamente pelo Asaas via CEP)
  complement: text("complement"),
  address: text("address"),
  city: text("city"),
  province: text("province"),
  // Asaas Integration
  asaasCustomerId: text("asaas_customer_id"),
  asaasPixPaymentId: text("asaas_pix_payment_id"),
  asaasBoletoPaymentId: text("asaas_boleto_payment_id"),
  asaasCreditCardPaymentId: text("asaas_creditcard_payment_id"),
  paymentMethod: text("payment_method"), // PIX, BOLETO, CREDIT_CARD - method that was actually paid
  paymentStatus: text("payment_status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPreRegistrationSchema = createInsertSchema(preRegistrations).omit({
  id: true,
  // Campos opcionais de endereço (preenchidos automaticamente pelo Asaas)
  address: true,
  city: true,
  province: true,
  // Asaas fields
  asaasCustomerId: true,
  asaasPixPaymentId: true,
  asaasBoletoPaymentId: true,
  asaasCreditCardPaymentId: true,
  paymentMethod: true, // Removido - só é definido após pagamento confirmado
  paymentStatus: true,
  createdAt: true,
}).extend({
  cpf: z.string().min(11, "CPF deve ter 11 dígitos").max(14, "CPF inválido"),
  amount: z.number().min(1, "Valor deve ser positivo"),
  // Validações de endereço obrigatórias para nota fiscal
  postalCode: z.string().min(8, "CEP é obrigatório").max(10, "CEP inválido").regex(/^\d{5}-?\d{3}$/, "CEP deve ter formato 00000-000"),
  addressNumber: z.string().min(1, "Número do endereço é obrigatório").max(20, "Número muito longo"),
  // Campos opcionais de endereço
  complement: z.string().max(255, "Complemento muito longo").optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type PreRegistration = typeof preRegistrations.$inferSelect;
export type InsertPreRegistration = z.infer<typeof insertPreRegistrationSchema>;

// Admin Dashboard Tables
export const moderadores = pgTable("moderadores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  email: text("email").notNull(),
  telefone: text("telefone").notNull(),
  salaPrincipal: text("sala_principal").notNull(),
  cargaHorariaSemanal: integer("carga_horaria_semanal").notNull(),
});

export const turmas = pgTable("turmas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  sala: text("sala").notNull(),
  turno: text("turno").notNull(),
  horario: text("horario").notNull(),
  moderadorId: varchar("moderador_id").references(() => moderadores.id),
  capacidadeTotal: integer("capacidade_total").notNull(),
  observacoes: text("observacoes"),
});

export const alunos = pgTable("alunos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  idade: integer("idade").notNull(),
  telefone: text("telefone").notNull(),
  email: text("email").notNull(),
  turnoPreferido: text("turno_preferido").notNull(),
  classificacao: text("classificacao").notNull(),
  turmaId: varchar("turma_id").references(() => turmas.id),
});

// Insert schemas
export const insertModeradorSchema = createInsertSchema(moderadores).omit({
  id: true,
}).extend({
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone deve ter no mínimo 10 dígitos"),
  cargaHorariaSemanal: z.number().min(1, "Carga horária deve ser positiva"),
});

export const insertTurmaSchema = createInsertSchema(turmas).omit({
  id: true,
}).extend({
  capacidadeTotal: z.number().min(1, "Capacidade deve ser no mínimo 1"),
});

export const insertAlunoSchema = createInsertSchema(alunos).omit({
  id: true,
}).extend({
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone deve ter no mínimo 10 dígitos"),
  idade: z.number().min(1, "Idade deve ser positiva"),
  classificacao: z.enum(["Matriculado", "Experimental"], {
    required_error: "Classificação é obrigatória",
  }),
});

// Types
export type Moderador = typeof moderadores.$inferSelect;
export type InsertModerador = z.infer<typeof insertModeradorSchema>;
export type Turma = typeof turmas.$inferSelect;
export type InsertTurma = z.infer<typeof insertTurmaSchema>;
export type Aluno = typeof alunos.$inferSelect;
export type InsertAluno = z.infer<typeof insertAlunoSchema>;
