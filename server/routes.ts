import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPreRegistrationSchema } from "@shared/schema";
import { z } from "zod";

// Use PRODUCTION by default, unless ASAAS_USE_SANDBOX is explicitly set to 'true'
const USE_SANDBOX = process.env.ASAAS_USE_SANDBOX === 'true';

console.log('🔧 ASAAS CONFIGURATION:');
console.log('ASAAS_USE_SANDBOX:', process.env.ASAAS_USE_SANDBOX);
console.log('Using SANDBOX mode:', USE_SANDBOX);

const ASAAS_API_KEY = USE_SANDBOX
  ? process.env.ASAAS_SANDBOX_API_KEY
  : process.env.ASAAS_API_KEY;

if (!ASAAS_API_KEY) {
  throw new Error('Missing required Asaas secret: ASAAS_API_KEY or ASAAS_SANDBOX_API_KEY');
}

const ASAAS_BASE_URL = USE_SANDBOX
  ? 'https://api-sandbox.asaas.com/v3'
  : 'https://api.asaas.com/v3';

console.log('Selected API Key from:', USE_SANDBOX ? 'SANDBOX' : 'PRODUCTION');
console.log('Using URL:', ASAAS_BASE_URL);

const ASAAS_HEADERS = {
  'access_token': ASAAS_API_KEY,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
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
  invoiceUrl?: string;
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

    if (!response.ok) {
      const error = await response.text();
      console.error('Erro da API Asaas ao criar cliente:', response.status, error);
      throw new Error(`Erro ao criar cliente no Asaas: ${error}`);
    }

    const data = await response.json();
    console.log('Cliente criado com sucesso:', data);
    return data;
  } catch (error) {
    console.error('Erro na função createAsaasCustomer:', error);
    throw error;
  }
}

async function createAsaasPayment(
  customerId: string, 
  value: number, 
  dueDate: string, 
  billingType: string
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

    if (!response.ok) {
      const error = await response.text();
      console.error('Erro da API Asaas ao criar pagamento:', response.status, error);
      throw new Error(`Erro ao criar pagamento no Asaas: ${error}`);
    }

    const data = await response.json();
    console.log('Pagamento criado com sucesso:', data);
    return data;
  } catch (error) {
    console.error('Erro na função createAsaasPayment:', error);
    throw error;
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

      // Only create Asaas customer - payments will be created on-demand
      console.log('Asaas customer created:', asaasCustomer.id);
      
      // Update pre-registration with customer ID only
      await storage.updatePreRegistrationWithCustomerId(
        preRegistration.id,
        asaasCustomer.id
      );

      res.json({ 
        success: true,
        preRegistrationId: preRegistration.id,
        customerId: asaasCustomer.id,
        message: "Pré-matrícula criada com sucesso! Escolha sua forma de pagamento."
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      } else {
        console.error('Erro ao processar pré-matrícula:', error);
        res.status(500).json({ message: "Erro interno do servidor. Tente novamente." });
      }
    }
  });

  // Create PIX payment on-demand
  app.post("/api/create-pix-payment/:preRegistrationId", async (req, res) => {
    try {
      const preRegistration = await storage.getPreRegistration(req.params.preRegistrationId);
      if (!preRegistration) {
        return res.status(404).json({ message: "Pré-matrícula não encontrada" });
      }

      if (!preRegistration.asaasCustomerId) {
        return res.status(400).json({ message: "Cliente Asaas não encontrado" });
      }

      // Create payment with 7 days from now as due date
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);
      const dueDateStr = dueDate.toISOString().split('T')[0];

      // Create PIX payment
      const pixPayment = await createAsaasPayment(
        preRegistration.asaasCustomerId,
        Number(preRegistration.amount),
        dueDateStr,
        'PIX'
      );

      // Get PIX QR Code
      let pixQrCode = null;
      try {
        const pixResponse = await fetch(`${ASAAS_BASE_URL}/payments/${pixPayment.id}/pixQrCode`, {
          headers: ASAAS_HEADERS
        });
        if (pixResponse.ok) {
          const pixData = await pixResponse.json();
          pixQrCode = pixData.payload || pixData.encodedImage;
        }
      } catch (error) {
        console.error('Erro ao buscar QR Code PIX:', error);
      }

      // Update pre-registration with PIX payment ID
      await storage.updatePreRegistrationWithSpecificPayment(
        preRegistration.id,
        pixPayment.id,
        'pix'
      );

      res.json({
        success: true,
        paymentType: 'PIX',
        paymentId: pixPayment.id,
        qrCode: pixQrCode
      });
    } catch (error: any) {
      console.error('Erro ao criar pagamento PIX:', error);
      res.status(500).json({ message: "Erro ao criar pagamento PIX. Tente novamente." });
    }
  });

  // Create BOLETO payment on-demand
  app.post("/api/create-boleto-payment/:preRegistrationId", async (req, res) => {
    try {
      const preRegistration = await storage.getPreRegistration(req.params.preRegistrationId);
      if (!preRegistration) {
        return res.status(404).json({ message: "Pré-matrícula não encontrada" });
      }

      if (!preRegistration.asaasCustomerId) {
        return res.status(400).json({ message: "Cliente Asaas não encontrado" });
      }

      // Create payment with 7 days from now as due date
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);
      const dueDateStr = dueDate.toISOString().split('T')[0];

      // Create BOLETO payment
      const boletoPayment = await createAsaasPayment(
        preRegistration.asaasCustomerId,
        Number(preRegistration.amount),
        dueDateStr,
        'BOLETO'
      );

      // Update pre-registration with BOLETO payment ID
      await storage.updatePreRegistrationWithSpecificPayment(
        preRegistration.id,
        boletoPayment.id,
        'boleto'
      );

      res.json({
        success: true,
        paymentType: 'BOLETO',
        paymentId: boletoPayment.id,
        bankSlipUrl: boletoPayment.bankSlipUrl
      });
    } catch (error: any) {
      console.error('Erro ao criar pagamento BOLETO:', error);
      res.status(500).json({ message: "Erro ao criar pagamento BOLETO. Tente novamente." });
    }
  });

  // Create CREDIT CARD payment on-demand
  app.post("/api/create-creditcard-payment/:preRegistrationId", async (req, res) => {
    try {
      const preRegistration = await storage.getPreRegistration(req.params.preRegistrationId);
      if (!preRegistration) {
        return res.status(404).json({ message: "Pré-matrícula não encontrada" });
      }

      if (!preRegistration.asaasCustomerId) {
        return res.status(400).json({ message: "Cliente Asaas não encontrado" });
      }

      // Create payment with 7 days from now as due date
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);
      const dueDateStr = dueDate.toISOString().split('T')[0];

      // Create CREDIT CARD payment
      const creditCardPayment = await createAsaasPayment(
        preRegistration.asaasCustomerId,
        Number(preRegistration.amount),
        dueDateStr,
        'CREDIT_CARD'
      );

      // Update pre-registration with CREDIT CARD payment ID
      await storage.updatePreRegistrationWithSpecificPayment(
        preRegistration.id,
        creditCardPayment.id,
        'creditcard'
      );

      res.json({
        success: true,
        paymentType: 'CREDIT_CARD',
        paymentId: creditCardPayment.id,
        url: creditCardPayment.invoiceUrl
      });
    } catch (error: any) {
      console.error('Erro ao criar pagamento CARTÃO:', error);
      res.status(500).json({ message: "Erro ao criar pagamento com cartão. Tente novamente." });
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

  // Webhook to handle payment confirmation (secured)
  app.post("/api/asaas-webhook", async (req, res) => {
    try {
      // Critical: require webhook secret in production
      const webhookSecret = process.env.ASAAS_WEBHOOK_SECRET;
      if (!webhookSecret) {
        console.error('ASAAS_WEBHOOK_SECRET não configurado');
        return res.status(500).json({ error: 'Server configuration error' });
      }

      const receivedSecret = req.headers['x-webhook-secret'];
      
      if (receivedSecret !== webhookSecret) {
        console.error('Webhook authentication failed - invalid secret');
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { event, payment } = req.body;

      console.log('Asaas webhook received:', event, payment?.id);

      if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
        if (!payment?.id) {
          console.error('Invalid webhook payload - missing payment ID');
          return res.status(400).json({ error: 'Invalid payload' });
        }

        // Verify payment status directly with Asaas API before updating
        const verificationResponse = await fetch(`${ASAAS_BASE_URL}/payments/${payment.id}`, {
          headers: ASAAS_HEADERS
        });

        if (!verificationResponse.ok) {
          console.error('Failed to verify payment status with Asaas');
          return res.status(500).json({ error: 'Payment verification failed' });
        }

        const verifiedPayment = await verificationResponse.json();
        
        // Only update if payment is actually received/confirmed
        if (verifiedPayment.status !== 'RECEIVED' && verifiedPayment.status !== 'CONFIRMED') {
          console.log(`Payment ${payment.id} verification failed - status: ${verifiedPayment.status}`);
          return res.status(400).json({ error: 'Payment not confirmed' });
        }

        // Find pre-registration by any payment ID (PIX, BOLETO, or CREDIT_CARD)
        const preReg = await storage.getPreRegistrationByAnyPaymentId(payment.id);
        
        if (preReg) {
          await storage.updatePreRegistrationPayment(
            preReg.id,
            payment.id,
            "paid",
            undefined,
            payment.billingType // Set the payment method that was actually used
          );
          console.log(`Payment confirmed for pre-registration ${preReg.id}`);
        } else {
          console.log(`No pre-registration found for payment ${payment.id}`);
        }
      } else {
        console.log(`Unhandled webhook event: ${event}`);
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}