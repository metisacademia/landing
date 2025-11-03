import { 
  type User, 
  type InsertUser, 
  type PreRegistration, 
  type InsertPreRegistration,
  type Moderador,
  type InsertModerador,
  type Turma,
  type InsertTurma,
  type Aluno,
  type InsertAluno,
  users, 
  preRegistrations,
  moderadores,
  turmas,
  alunos
} from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, like, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const sqlClient = neon(process.env.DATABASE_URL);
const db = drizzle(sqlClient);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createPreRegistration(preReg: InsertPreRegistration): Promise<PreRegistration>;
  getPreRegistration(id: string): Promise<PreRegistration | undefined>;
  updatePreRegistrationWithAllPayments(id: string, pixPaymentId: string, boletoPaymentId: string, creditCardPaymentId: string, customerId: string): Promise<PreRegistration>;
  updatePreRegistrationWithCustomerId(id: string, customerId: string): Promise<PreRegistration>;
  updatePreRegistrationWithSpecificPayment(id: string, paymentId: string, paymentType: 'pix' | 'boleto' | 'creditcard'): Promise<PreRegistration>;
  updatePreRegistrationPayment(id: string, paymentId: string, status: string, customerId?: string, paymentMethod?: string): Promise<PreRegistration>;
  getPreRegistrationByAnyPaymentId(paymentId: string): Promise<PreRegistration | undefined>;
  getAllPreRegistrations(): Promise<PreRegistration[]>;
  
  // Moderadores
  createModerador(moderador: InsertModerador): Promise<Moderador>;
  getAllModeradores(): Promise<Moderador[]>;
  getModerador(id: string): Promise<Moderador | undefined>;
  updateModerador(id: string, moderador: Partial<InsertModerador>): Promise<Moderador>;
  deleteModerador(id: string): Promise<void>;
  searchModeradores(searchTerm: string): Promise<Moderador[]>;
  
  // Turmas
  createTurma(turma: InsertTurma): Promise<Turma>;
  getAllTurmas(): Promise<Turma[]>;
  getTurma(id: string): Promise<Turma | undefined>;
  updateTurma(id: string, turma: Partial<InsertTurma>): Promise<Turma>;
  deleteTurma(id: string): Promise<void>;
  getTurmasByTurno(turno: string): Promise<Turma[]>;
  getTurmasBySala(sala: string): Promise<Turma[]>;
  
  // Alunos
  createAluno(aluno: InsertAluno): Promise<Aluno>;
  getAllAlunos(): Promise<Aluno[]>;
  getAluno(id: string): Promise<Aluno | undefined>;
  updateAluno(id: string, aluno: Partial<InsertAluno>): Promise<Aluno>;
  deleteAluno(id: string): Promise<void>;
  searchAlunos(searchTerm: string): Promise<Aluno[]>;
  getAlunosByTurma(turmaId: string): Promise<Aluno[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async createPreRegistration(insertPreReg: InsertPreRegistration): Promise<PreRegistration> {
    const result = await db.insert(preRegistrations).values({
      ...insertPreReg,
      amount: insertPreReg.amount.toString(), // Convert number to string for decimal field
      horario: insertPreReg.horario || null,
      observacoes: insertPreReg.observacoes || null,
    }).returning();
    return result[0];
  }

  async getPreRegistration(id: string): Promise<PreRegistration | undefined> {
    const result = await db.select().from(preRegistrations).where(eq(preRegistrations.id, id)).limit(1);
    return result[0];
  }

  async updatePreRegistrationWithAllPayments(id: string, pixPaymentId: string, boletoPaymentId: string, creditCardPaymentId: string, customerId: string): Promise<PreRegistration> {
    const result = await db.update(preRegistrations)
      .set({
        asaasPixPaymentId: pixPaymentId,
        asaasBoletoPaymentId: boletoPaymentId,
        asaasCreditCardPaymentId: creditCardPaymentId,
        asaasCustomerId: customerId,
      })
      .where(eq(preRegistrations.id, id))
      .returning();
    
    if (result.length === 0) {
      throw new Error("Pre-registration not found");
    }
    
    return result[0];
  }

  async updatePreRegistrationWithCustomerId(id: string, customerId: string): Promise<PreRegistration> {
    const result = await db.update(preRegistrations)
      .set({
        asaasCustomerId: customerId,
      })
      .where(eq(preRegistrations.id, id))
      .returning();
    
    if (result.length === 0) {
      throw new Error("Pre-registration not found");
    }
    
    return result[0];
  }

  async updatePreRegistrationWithSpecificPayment(id: string, paymentId: string, paymentType: 'pix' | 'boleto' | 'creditcard'): Promise<PreRegistration> {
    let updateData: any = {};
    
    if (paymentType === 'pix') {
      updateData.asaasPixPaymentId = paymentId;
    } else if (paymentType === 'boleto') {
      updateData.asaasBoletoPaymentId = paymentId;
    } else if (paymentType === 'creditcard') {
      updateData.asaasCreditCardPaymentId = paymentId;
    }
    
    const result = await db.update(preRegistrations)
      .set(updateData)
      .where(eq(preRegistrations.id, id))
      .returning();
    
    if (result.length === 0) {
      throw new Error("Pre-registration not found");
    }
    
    return result[0];
  }

  async updatePreRegistrationPayment(id: string, paymentId: string, status: string, customerId?: string, paymentMethod?: string): Promise<PreRegistration> {
    const updateData: any = { 
      paymentStatus: status 
    };
    
    if (customerId) {
      updateData.asaasCustomerId = customerId;
    }
    
    if (paymentMethod) {
      updateData.paymentMethod = paymentMethod;
    }
    
    const result = await db.update(preRegistrations)
      .set(updateData)
      .where(eq(preRegistrations.id, id))
      .returning();
    
    if (result.length === 0) {
      throw new Error("Pre-registration not found");
    }
    
    return result[0];
  }

  async getPreRegistrationByAnyPaymentId(paymentId: string): Promise<PreRegistration | undefined> {
    // Search for pre-registration by any of the three payment IDs
    const result = await db.select().from(preRegistrations).where(
      eq(preRegistrations.asaasPixPaymentId, paymentId)
    ).limit(1);

    if (result.length > 0) {
      return result[0];
    }

    const result2 = await db.select().from(preRegistrations).where(
      eq(preRegistrations.asaasBoletoPaymentId, paymentId)
    ).limit(1);

    if (result2.length > 0) {
      return result2[0];
    }

    const result3 = await db.select().from(preRegistrations).where(
      eq(preRegistrations.asaasCreditCardPaymentId, paymentId)
    ).limit(1);

    if (result3.length > 0) {
      return result3[0];
    }

    return undefined;
  }

  async getAllPreRegistrations(): Promise<PreRegistration[]> {
    return await db.select().from(preRegistrations);
  }

  // Moderadores
  async createModerador(insertModerador: InsertModerador): Promise<Moderador> {
    const result = await db.insert(moderadores).values(insertModerador).returning();
    return result[0];
  }

  async getAllModeradores(): Promise<Moderador[]> {
    return await db.select().from(moderadores);
  }

  async getModerador(id: string): Promise<Moderador | undefined> {
    const result = await db.select().from(moderadores).where(eq(moderadores.id, id)).limit(1);
    return result[0];
  }

  async updateModerador(id: string, updateData: Partial<InsertModerador>): Promise<Moderador> {
    const result = await db.update(moderadores)
      .set(updateData)
      .where(eq(moderadores.id, id))
      .returning();
    
    if (result.length === 0) {
      throw new Error("Moderador não encontrado");
    }
    
    return result[0];
  }

  async deleteModerador(id: string): Promise<void> {
    await db.delete(moderadores).where(eq(moderadores.id, id));
  }

  async searchModeradores(searchTerm: string): Promise<Moderador[]> {
    return await db.select().from(moderadores)
      .where(like(moderadores.nome, `%${searchTerm}%`));
  }

  // Turmas
  async createTurma(insertTurma: InsertTurma): Promise<Turma> {
    const result = await db.insert(turmas).values(insertTurma).returning();
    return result[0];
  }

  async getAllTurmas(): Promise<Turma[]> {
    return await db.select().from(turmas);
  }

  async getTurma(id: string): Promise<Turma | undefined> {
    const result = await db.select().from(turmas).where(eq(turmas.id, id)).limit(1);
    return result[0];
  }

  async updateTurma(id: string, updateData: Partial<InsertTurma>): Promise<Turma> {
    const result = await db.update(turmas)
      .set(updateData)
      .where(eq(turmas.id, id))
      .returning();
    
    if (result.length === 0) {
      throw new Error("Turma não encontrada");
    }
    
    return result[0];
  }

  async deleteTurma(id: string): Promise<void> {
    await db.delete(turmas).where(eq(turmas.id, id));
  }

  async getTurmasByTurno(turno: string): Promise<Turma[]> {
    return await db.select().from(turmas).where(eq(turmas.turno, turno));
  }

  async getTurmasBySala(sala: string): Promise<Turma[]> {
    return await db.select().from(turmas).where(eq(turmas.sala, sala));
  }

  // Alunos
  async createAluno(insertAluno: InsertAluno): Promise<Aluno> {
    const result = await db.insert(alunos).values(insertAluno).returning();
    return result[0];
  }

  async getAllAlunos(): Promise<Aluno[]> {
    return await db.select().from(alunos);
  }

  async getAluno(id: string): Promise<Aluno | undefined> {
    const result = await db.select().from(alunos).where(eq(alunos.id, id)).limit(1);
    return result[0];
  }

  async updateAluno(id: string, updateData: Partial<InsertAluno>): Promise<Aluno> {
    const result = await db.update(alunos)
      .set(updateData)
      .where(eq(alunos.id, id))
      .returning();
    
    if (result.length === 0) {
      throw new Error("Aluno não encontrado");
    }
    
    return result[0];
  }

  async deleteAluno(id: string): Promise<void> {
    await db.delete(alunos).where(eq(alunos.id, id));
  }

  async searchAlunos(searchTerm: string): Promise<Aluno[]> {
    return await db.select().from(alunos)
      .where(like(alunos.nome, `%${searchTerm}%`));
  }

  async getAlunosByTurma(turmaId: string): Promise<Aluno[]> {
    return await db.select().from(alunos).where(eq(alunos.turmaId, turmaId));
  }
}

export const storage = new DatabaseStorage();
