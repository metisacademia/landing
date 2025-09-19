import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertPreRegistrationSchema } from "@shared/schema";
import { z } from "zod";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function registerRoutes(app: Express): Promise<Server> {
  // Create pre-registration and payment intent
  app.post("/api/create-pre-registration", async (req, res) => {
    try {
      const validatedData = insertPreRegistrationSchema.parse(req.body);
      
      // Create pre-registration record
      const preRegistration = await storage.createPreRegistration(validatedData);
      
      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(Number(validatedData.amount) * 100), // Convert to cents
        currency: "brl",
        metadata: {
          preRegistrationId: preRegistration.id,
          plano: validatedData.plano,
          nome: validatedData.nome,
          email: validatedData.email,
        },
      });

      // Update pre-registration with payment intent ID
      await storage.updatePreRegistrationPayment(
        preRegistration.id,
        paymentIntent.id,
        "pending"
      );

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        preRegistrationId: preRegistration.id,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      } else {
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

  // Webhook to handle payment confirmation
  app.post("/api/stripe-webhook", async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig as string, process.env.STRIPE_WEBHOOK_SECRET || '');
    } catch (err: any) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const preRegistrationId = paymentIntent.metadata.preRegistrationId;
      
      if (preRegistrationId) {
        await storage.updatePreRegistrationPayment(
          preRegistrationId,
          paymentIntent.id,
          "succeeded"
        );
      }
    }

    res.json({ received: true });
  });

  const httpServer = createServer(app);

  return httpServer;
}
