import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  gender: text("gender").notNull(),
  allergies: text("allergies"),
  currentMedications: text("current_medications"),
  medicalHistory: text("medical_history"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const patientDocuments = pgTable("patient_documents", {
  id: serial("id").primaryKey(),
  patientId: serial("patient_id").references(() => patients.id),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  // Using text type for bytea columns, as Drizzle will handle the conversion
  encryptedData: text("encrypted_data", { mode: "bytea" }).notNull(),
  encryptionIV: text("encryption_iv", { mode: "bytea" }).notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  documentType: text("document_type").notNull(), // e.g., "lab_result", "prescription", "imaging"
  metadata: jsonb("metadata").$type<{
    size: number;
    lastModified: string;
    tags?: string[];
  }>(),
});

export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  patientId: serial("patient_id").references(() => patients.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  actionItems: jsonb("action_items").$type<string[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const diagnosticTests = pgTable("diagnostic_tests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: serial("price").notNull(),
  preparationSteps: jsonb("preparation_steps").$type<string[]>().notNull(),
});

export const testOrders = pgTable("test_orders", {
  id: serial("id").primaryKey(),
  patientId: serial("patient_id").references(() => patients.id),
  testId: serial("test_id").references(() => diagnosticTests.id),
  status: text("status").notNull(),
  orderedAt: timestamp("ordered_at").defaultNow(),
});

export type Patient = typeof patients.$inferSelect;
export type NewPatient = typeof patients.$inferInsert;
export type PatientDocument = typeof patientDocuments.$inferSelect;
export type NewPatientDocument = typeof patientDocuments.$inferInsert;

export const insertPatientSchema = createInsertSchema(patients);
export const selectPatientSchema = createSelectSchema(patients);
export const insertPatientDocumentSchema = createInsertSchema(patientDocuments);
export const selectPatientDocumentSchema = createSelectSchema(patientDocuments);