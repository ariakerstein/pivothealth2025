import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { patients, diagnosticTests, recommendations, testOrders, patientDocuments } from "@db/schema";
import { eq } from "drizzle-orm";
import multer from "multer";
import { encryptBuffer, decryptBuffer } from "./utils/encryption";

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

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

  // Document upload endpoint
  app.post("/api/documents/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { buffer, originalname, mimetype } = req.file;
      const { documentType } = req.body;

      // Encrypt the file buffer
      const { encryptedData, iv } = encryptBuffer(buffer);

      const [document] = await db
        .insert(patientDocuments)
        .values({
          patientId: 1, // TODO: Get from auth
          filename: originalname,
          contentType: mimetype,
          encryptedData: encryptedData.toString('base64'),
          encryptionIV: iv.toString('base64'),
          documentType,
          metadata: {
            size: buffer.length,
            lastModified: new Date().toISOString(),
          },
        })
        .returning();

      res.json(document);
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: "Failed to upload document" });
    }
  });

  // Document retrieval endpoint
  app.get("/api/documents", async (_req, res) => {
    try {
      const documents = await db
        .select()
        .from(patientDocuments)
        .orderBy(patientDocuments.uploadedAt);

      // Don't send the encrypted data in the list
      const sanitizedDocs = documents.map(({ encryptedData, encryptionIV, ...doc }) => doc);
      res.json(sanitizedDocs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  // Document download endpoint
  app.get("/api/documents/:id", async (req, res) => {
    try {
      const [document] = await db
        .select()
        .from(patientDocuments)
        .where(eq(patientDocuments.id, parseInt(req.params.id)))
        .limit(1);

      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      // Decrypt the document
      const encryptedData = Buffer.from(document.encryptedData, 'base64');
      const iv = Buffer.from(document.encryptionIV, 'base64');
      const decryptedBuffer = decryptBuffer(encryptedData, iv);

      res.setHeader('Content-Type', document.contentType);
      res.setHeader('Content-Disposition', `inline; filename="${document.filename}"`);
      res.send(decryptedBuffer);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve document" });
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