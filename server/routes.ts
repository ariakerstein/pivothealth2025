import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { patients, diagnosticTests, recommendations, testOrders } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  app.post("/api/patient/onboarding", async (req, res) => {
    try {
      const [patient] = await db
        .insert(patients)
        .values(req.body)
        .returning();
      res.json(patient);
    } catch (error) {
      res.status(500).json({ error: "Failed to save patient data" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-small-128k-online",
          messages: [
            {
              role: "system",
              content: "You are a helpful medical AI assistant. Provide accurate, concise medical information while noting that you are not a replacement for professional medical advice."
            },
            ...req.body.messages
          ],
          temperature: 0.2,
        }),
      });

      const data = await response.json();
      res.json({ message: data.choices[0].message.content });
    } catch (error) {
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  app.get("/api/recommendations", async (_req, res) => {
    try {
      const result = await db.select().from(recommendations);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  });

  app.get("/api/tests", async (_req, res) => {
    try {
      const result = await db.select().from(diagnosticTests);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tests" });
    }
  });

  app.post("/api/tests/order", async (req, res) => {
    try {
      const [order] = await db
        .insert(testOrders)
        .values({
          patientId: 1, // TODO: Get from auth
          testId: req.body.testId,
          status: "pending"
        })
        .returning();
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to create test order" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
