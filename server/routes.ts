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
  postalCode?: string;
  addressNumber?: string;
  complement?: string;
  address?: string;
  city?: string;
  province?: string;
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

async function createAsaasCustomer(
  nome: string, 
  email: string, 
  cpf: string, 
  telefone?: string, 
  postalCode?: string, 
  addressNumber?: string, 
  complement?: string
): Promise<AsaasCustomer> {
  try {
    console.log('Tentando criar cliente Asaas:', { nome, email, cpf, postalCode, addressNumber });
    
    const customerData: any = {
      name: nome,
      email: email,
      cpfCnpj: cpf,
      phone: telefone
    };
    
    // Adicionar dados de endereço se fornecidos (obrigatórios para nota fiscal)
    if (postalCode && addressNumber) {
      customerData.postalCode = postalCode;
      customerData.addressNumber = addressNumber;
      if (complement) {
        customerData.complement = complement;
      }
      console.log('🏠 [ASAAS] Criando cliente com endereço para nota fiscal automática');
    }
    
    const response = await fetch(`${ASAAS_BASE_URL}/customers`, {
      method: 'POST',
      headers: ASAAS_HEADERS,
      body: JSON.stringify(customerData)
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
      
      // Create Asaas customer with address data for automatic invoice generation
      const asaasCustomer = await createAsaasCustomer(
        validatedData.nome,
        validatedData.email,
        validatedData.cpf,
        validatedData.telefone,
        validatedData.postalCode,
        validatedData.addressNumber,
        validatedData.complement
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
    const timestamp = new Date().toISOString();
    console.log(`\n🔔 [WEBHOOK ${timestamp}] Recebendo notificação do Asaas...`);
    
    try {
      // Critical: require webhook secret in production
      const webhookSecret = process.env.ASAAS_WEBHOOK_SECRET;
      if (!webhookSecret) {
        console.error('❌ [WEBHOOK] ASAAS_WEBHOOK_SECRET não configurado');
        return res.status(500).json({ error: 'Server configuration error' });
      }

      const receivedSecret = req.headers['x-webhook-secret'];
      console.log(`🔐 [WEBHOOK] Secret recebido: ${receivedSecret ? '[PRESENTE]' : '[AUSENTE]'}`);
      
      if (receivedSecret !== webhookSecret) {
        console.error('❌ [WEBHOOK] Autenticação falhou - secret inválido');
        console.error(`Expected: ${webhookSecret.substring(0, 10)}...`);
        console.error(`Received: ${String(receivedSecret).substring(0, 10)}...`);
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { event, payment } = req.body;
      console.log(`📋 [WEBHOOK] Dados recebidos:`, {
        event,
        paymentId: payment?.id,
        paymentStatus: payment?.status,
        billingType: payment?.billingType,
        fullPayload: req.body
      });

      if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
        if (!payment?.id) {
          console.error('❌ [WEBHOOK] Payload inválido - Payment ID ausente');
          return res.status(400).json({ error: 'Invalid payload' });
        }

        console.log(`🔍 [WEBHOOK] Verificando pagamento ${payment.id} no Asaas...`);
        
        // Verify payment status directly with Asaas API before updating
        const verificationResponse = await fetch(`${ASAAS_BASE_URL}/payments/${payment.id}`, {
          headers: ASAAS_HEADERS
        });

        if (!verificationResponse.ok) {
          console.error(`❌ [WEBHOOK] Falha na verificação com Asaas - Status: ${verificationResponse.status}`);
          return res.status(500).json({ error: 'Payment verification failed' });
        }

        const verifiedPayment = await verificationResponse.json();
        console.log(`✅ [WEBHOOK] Pagamento verificado no Asaas:`, {
          id: verifiedPayment.id,
          status: verifiedPayment.status,
          billingType: verifiedPayment.billingType,
          value: verifiedPayment.value
        });
        
        // Only update if payment is actually received/confirmed
        if (verifiedPayment.status !== 'RECEIVED' && verifiedPayment.status !== 'CONFIRMED') {
          console.log(`⚠️ [WEBHOOK] Status não confirmado - ${verifiedPayment.status}`);
          return res.status(400).json({ error: 'Payment not confirmed' });
        }

        // Find pre-registration by any payment ID (PIX, BOLETO, or CREDIT_CARD)
        console.log(`🔍 [WEBHOOK] Buscando pré-matrícula com payment ID: ${payment.id}`);
        const preReg = await storage.getPreRegistrationByAnyPaymentId(payment.id);
        
        if (preReg) {
          console.log(`✅ [WEBHOOK] Pré-matrícula encontrada:`, {
            id: preReg.id,
            nome: preReg.nome,
            currentStatus: preReg.paymentStatus,
            pixPaymentId: preReg.asaasPixPaymentId,
            boletoPaymentId: preReg.asaasBoletoPaymentId,
            creditCardPaymentId: preReg.asaasCreditCardPaymentId
          });
          
          await storage.updatePreRegistrationPayment(
            preReg.id,
            payment.id,
            "paid",
            undefined,
            verifiedPayment.billingType
          );
          console.log(`🎉 [WEBHOOK] Pagamento confirmado para pré-matrícula ${preReg.id} - Método: ${verifiedPayment.billingType}`);
        } else {
          console.error(`❌ [WEBHOOK] Pré-matrícula não encontrada para payment ${payment.id}`);
          
          // Log all current pre-registrations for debug
          const allPreRegs = await storage.getAllPreRegistrations();
          console.log(`🔍 [DEBUG] Total pré-matrículas no banco: ${allPreRegs.length}`);
          allPreRegs.slice(-5).forEach(pr => {
            console.log(`   - ID: ${pr.id}, PIX: ${pr.asaasPixPaymentId}, BOLETO: ${pr.asaasBoletoPaymentId}, CARD: ${pr.asaasCreditCardPaymentId}`);
          });
        }
      } else {
        console.log(`ℹ️ [WEBHOOK] Evento não processado: ${event}`);
      }

      console.log(`✅ [WEBHOOK] Processamento concluído\n`);
      res.json({ received: true });
    } catch (error: any) {
      console.error('💥 [WEBHOOK] Erro durante processamento:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Debug endpoint to test webhook manually
  app.post("/api/debug/test-webhook", async (req, res) => {
    try {
      const { paymentId, event = 'PAYMENT_RECEIVED', billingType = 'PIX' } = req.body;
      
      if (!paymentId) {
        return res.status(400).json({ error: 'paymentId é obrigatório' });
      }

      console.log(`\n🧪 [DEBUG WEBHOOK] Testando webhook para payment: ${paymentId}`);
      
      // Simulate webhook payload
      const webhookPayload = {
        event,
        payment: {
          id: paymentId,
          status: 'RECEIVED',
          billingType
        }
      };

      // Make internal request to webhook endpoint
      const webhookResponse = await fetch(`http://localhost:5000/api/asaas-webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-webhook-secret': process.env.ASAAS_WEBHOOK_SECRET || ''
        },
        body: JSON.stringify(webhookPayload)
      });

      const result = await webhookResponse.json();
      
      res.json({
        success: true,
        webhookStatus: webhookResponse.status,
        webhookResponse: result,
        testedPayload: webhookPayload
      });
    } catch (error: any) {
      console.error('🧪 [DEBUG WEBHOOK] Erro:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Debug endpoint to check payment and pre-registration status
  app.get("/api/debug/payment/:paymentId", async (req, res) => {
    try {
      const paymentId = req.params.paymentId;
      
      console.log(`\n🔍 [DEBUG] Verificando status do payment: ${paymentId}`);
      
      // Check in database
      const preReg = await storage.getPreRegistrationByAnyPaymentId(paymentId);
      
      // Check in Asaas
      let asaasPayment = null;
      try {
        const response = await fetch(`${ASAAS_BASE_URL}/payments/${paymentId}`, {
          headers: ASAAS_HEADERS
        });
        if (response.ok) {
          asaasPayment = await response.json();
        }
      } catch (error) {
        console.log('Erro ao buscar no Asaas:', error);
      }
      
      res.json({
        paymentId,
        foundInDatabase: !!preReg,
        preRegistration: preReg ? {
          id: preReg.id,
          nome: preReg.nome,
          paymentStatus: preReg.paymentStatus,
          paymentMethod: preReg.paymentMethod,
          asaasPixPaymentId: preReg.asaasPixPaymentId,
          asaasBoletoPaymentId: preReg.asaasBoletoPaymentId,
          asaasCreditCardPaymentId: preReg.asaasCreditCardPaymentId
        } : null,
        asaasPayment: asaasPayment ? {
          id: asaasPayment.id,
          status: asaasPayment.status,
          billingType: asaasPayment.billingType,
          value: asaasPayment.value
        } : null
      });
    } catch (error: any) {
      console.error('🔍 [DEBUG] Erro:', error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}