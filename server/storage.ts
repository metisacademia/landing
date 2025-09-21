import { type User, type InsertUser, type PreRegistration, type InsertPreRegistration, users, preRegistrations } from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

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
}

export const storage = new DatabaseStorage();
