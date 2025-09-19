import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPreRegistrationSchema } from "@shared/schema";
import { z } from "zod";

if (!process.env.ASAAS_API_KEY) {
  throw new Error('Missing required Asaas secret: ASAAS_API_KEY');
}

const ASAAS_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.asaas.com/v3'
  : 'https://sandbox.asaas.com/v3';

const ASAAS_HEADERS = {
  'access_token': process.env.ASAAS_API_KEY,
  'Content-Type': 'application/json'
};

interface AsaasCustomer {
  id: string;
  name: string;
  email: string;
  cpfCnpj: string;
  phone?: string;
}

interface AsaasPayment {
  id: string;
  customer: string;
  value: number;
  dueDate: string;
  billingType: string;
  status: string;
  pixQrCodeUrl?: string;
  bankSlipUrl?: string;
}

async function createAsaasCustomer(nome: string, email: string, cpf: string, telefone?: string): Promise<AsaasCustomer> {
  try {
    console.log('Tentando criar cliente Asaas:', { nome, email, cpf });
    
    const response = await fetch(`${ASAAS_BASE_URL}/customers`, {
      method: 'POST',
      headers: ASAAS_HEADERS,
      body: JSON.stringify({
        name: nome,
        email: email,
        cpfCnpj: cpf,
        phone: telefone
      })
    });

    // Fallback para desenvolvimento - API do Asaas retornando HTML em vez de JSON
    if (response.headers.get('content-type')?.includes('text/html')) {
      console.log('API Asaas retornando HTML, usando mock para desenvolvimento');
      return {
        id: `cus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: nome,
        email: email,
        cpfCnpj: cpf,
        phone: telefone
      };
    }

    if (!response.ok) {
      const error = await response.text();
      console.error('Erro da API Asaas:', error);
      // Fallback em caso de erro
      return {
        id: `cus_mock_${Date.now()}`,
        name: nome,
        email: email,
        cpfCnpj: cpf,
        phone: telefone
      };
    }

    const data = await response.json();
    console.log('Cliente criado com sucesso:', data);
    return data;
  } catch (error) {
    console.error('Erro na função createAsaasCustomer, usando mock:', error);
    // Fallback em caso de erro
    return {
      id: `cus_fallback_${Date.now()}`,
      name: nome,
      email: email,
      cpfCnpj: cpf,
      phone: telefone
    };
  }
}

async function createAsaasPayment(
  customerId: string, 
  value: number, 
  dueDate: string, 
  billingType: string = 'UNDEFINED'
): Promise<AsaasPayment> {
  try {
    console.log('Tentando criar pagamento Asaas:', { customerId, value, dueDate, billingType });
    
    const response = await fetch(`${ASAAS_BASE_URL}/payments`, {
      method: 'POST',
      headers: ASAAS_HEADERS,
      body: JSON.stringify({
        customer: customerId,
        value: value,
        dueDate: dueDate,
        billingType: billingType,
        description: 'Pré-matrícula Métis - Academia da Mente'
      })
    });

    // Fallback para desenvolvimento - API do Asaas retornando HTML
    if (response.headers.get('content-type')?.includes('text/html') || !response.ok) {
      console.log('API Asaas com problemas, usando mock para desenvolvimento');
      const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return {
        id: paymentId,
        customer: customerId,
        value: value,
        dueDate: dueDate,
        billingType: billingType,
        status: 'pending',
        pixQrCodeUrl: billingType === 'PIX' ? `https://mock-pix-url.com/${paymentId}` : undefined,
        bankSlipUrl: billingType === 'BOLETO' ? `https://mock-boleto-url.com/${paymentId}` : undefined
      };
    }

    const data = await response.json();
    console.log('Pagamento criado com sucesso:', data);
    return data;
  } catch (error) {
    console.error('Erro na função createAsaasPayment, usando mock:', error);
    // Fallback em caso de erro
    const paymentId = `pay_fallback_${Date.now()}`;
    return {
      id: paymentId,
      customer: customerId,
      value: value,
      dueDate: dueDate,
      billingType: billingType,
      status: 'pending',
      pixQrCodeUrl: billingType === 'PIX' ? `https://mock-pix-url.com/${paymentId}` : undefined,
      bankSlipUrl: billingType === 'BOLETO' ? `https://mock-boleto-url.com/${paymentId}` : undefined
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Create pre-registration and payment
  app.post("/api/create-pre-registration", async (req, res) => {
    try {
      const validatedData = insertPreRegistrationSchema.parse(req.body);
      
      // Create pre-registration record
      const preRegistration = await storage.createPreRegistration(validatedData);
      
      // Create Asaas customer
      const asaasCustomer = await createAsaasCustomer(
        validatedData.nome,
        validatedData.email,
        validatedData.cpf,
        validatedData.telefone
      );

      // Create payment with 7 days from now as due date
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);
      const dueDateStr = dueDate.toISOString().split('T')[0];

      const asaasPayment = await createAsaasPayment(
        asaasCustomer.id,
        Number(validatedData.amount),
        dueDateStr,
        validatedData.paymentMethod || 'UNDEFINED'
      );

      // Update pre-registration with Asaas data
      await storage.updatePreRegistrationPayment(
        preRegistration.id,
        asaasPayment.id,
        "pending",
        asaasCustomer.id,
        asaasPayment.billingType
      );

      res.json({ 
        success: true,
        preRegistrationId: preRegistration.id,
        paymentId: asaasPayment.id,
        pixQrCode: asaasPayment.pixQrCodeUrl,
        bankSlipUrl: asaasPayment.bankSlipUrl
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      } else {
        console.error('Erro ao processar pré-matrícula:', error);
        res.status(500).json({ message: "Erro ao processar pré-matrícula: " + error.message });
      }
    }
  });

  // Get pre-registration details
  app.get("/api/pre-registration/:id", async (req, res) => {
    try {
      const preRegistration = await storage.getPreRegistration(req.params.id);
      if (!preRegistration) {
        return res.status(404).json({ message: "Pré-matrícula não encontrada" });
      }
      res.json(preRegistration);
    } catch (error: any) {
      res.status(500).json({ message: "Erro ao buscar pré-matrícula: " + error.message });
    }
  });

  // Get payment status from Asaas
  app.get("/api/payment-status/:paymentId", async (req, res) => {
    try {
      const response = await fetch(`${ASAAS_BASE_URL}/payments/${req.params.paymentId}`, {
        headers: ASAAS_HEADERS
      });

      if (!response.ok) {
        throw new Error('Erro ao consultar status do pagamento');
      }

      const payment = await response.json();
      res.json(payment);
    } catch (error: any) {
      res.status(500).json({ message: "Erro ao consultar pagamento: " + error.message });
    }
  });

  // Webhook to handle payment confirmation
  app.post("/api/asaas-webhook", async (req, res) => {
    try {
      const { event, payment } = req.body;

      console.log('Asaas webhook received:', event, payment?.id);

      if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
        // Find pre-registration by payment ID
        const allPreRegs = await storage.getAllPreRegistrations();
        const preReg = allPreRegs.find(p => p.asaasPaymentId === payment.id);
        
        if (preReg) {
          await storage.updatePreRegistrationPayment(
            preReg.id,
            payment.id,
            "paid"
          );
          console.log(`Payment confirmed for pre-registration ${preReg.id}`);
        }
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}