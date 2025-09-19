import { type User, type InsertUser, type PreRegistration, type InsertPreRegistration } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createPreRegistration(preReg: InsertPreRegistration): Promise<PreRegistration>;
  getPreRegistration(id: string): Promise<PreRegistration | undefined>;
  updatePreRegistrationPayment(id: string, paymentIntentId: string, status: string): Promise<PreRegistration>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private preRegistrations: Map<string, PreRegistration>;

  constructor() {
    this.users = new Map();
    this.preRegistrations = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createPreRegistration(insertPreReg: InsertPreRegistration): Promise<PreRegistration> {
    const id = randomUUID();
    const preReg: PreRegistration = {
      ...insertPreReg,
      id,
      horario: insertPreReg.horario || null,
      observacoes: insertPreReg.observacoes || null,
      stripePaymentIntentId: null,
      paymentStatus: "pending",
      createdAt: new Date(),
    };
    this.preRegistrations.set(id, preReg);
    return preReg;
  }

  async getPreRegistration(id: string): Promise<PreRegistration | undefined> {
    return this.preRegistrations.get(id);
  }

  async updatePreRegistrationPayment(id: string, paymentIntentId: string, status: string): Promise<PreRegistration> {
    const preReg = this.preRegistrations.get(id);
    if (!preReg) {
      throw new Error("Pre-registration not found");
    }
    
    const updated: PreRegistration = {
      ...preReg,
      stripePaymentIntentId: paymentIntentId,
      paymentStatus: status,
    };
    
    this.preRegistrations.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
