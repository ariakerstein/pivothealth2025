import { pgTable, text, serial, timestamp, jsonb, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// User Authentication Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

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
  patientId: integer("patient_id").references(() => patients.id),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  encryptedData: text("encrypted_data").notNull(),
  encryptionIV: text("encryption_iv").notNull(),
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
  patientId: integer("patient_id").references(() => patients.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // e.g., "Lifestyle", "Screening", "Prevention"
  priority: text("priority").notNull(), // "High", "Medium", "Low"
  actionItems: jsonb("action_items").$type<string[]>().notNull(),
  suggestedTests: jsonb("suggested_tests").$type<{
    testId: number;
    reason: string;
  }[]>(),
  supportingData: jsonb("supporting_data").$type<{
    type: string;
    value: number;
    context: string;
  }[]>(),
  status: text("status").notNull().default("active"), // "active", "completed", "dismissed"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const diagnosticTests = pgTable("diagnostic_tests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  preparationSteps: jsonb("preparation_steps").$type<string[]>().notNull(),
});

export const testOrders = pgTable("test_orders", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id),
  testId: integer("test_id").references(() => diagnosticTests.id),
  status: text("status").notNull(),
  orderedAt: timestamp("ordered_at").defaultNow(),
});

export const riskAssessments = pgTable("risk_assessments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id),
  assessmentDate: date("assessment_date").notNull(),
  riskFactors: jsonb("risk_factors").$type<{
    age: number;
    psaLevel: number;
    familyHistory: boolean;
    previousBiopsies: number;
    otherConditions: string[];
  }>().notNull(),
  riskScore: integer("risk_score").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(), // Lucide icon name
  category: text("category").notNull(), // e.g., "Prevention", "Engagement", "Progress"
  requirement: jsonb("requirement").$type<{
    type: "recommendation_completion" | "streak" | "health_score",
    target: number,
    timeframe?: string // e.g., "daily", "weekly", "monthly"
  }>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const patientAchievements = pgTable("patient_achievements", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id),
  achievementId: integer("achievement_id").references(() => achievements.id),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  progress: integer("progress").notNull().default(0),
});

export const patientStreak = pgTable("patient_streak", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastActivityDate: date("last_activity_date"),
  streakStartDate: date("streak_start_date"),
});

export type Patient = typeof patients.$inferSelect;
export type NewPatient = typeof patients.$inferInsert;
export type PatientDocument = typeof patientDocuments.$inferSelect;
export type NewPatientDocument = typeof patientDocuments.$inferInsert;
export type RiskAssessment = typeof riskAssessments.$inferSelect;
export type NewRiskAssessment = typeof riskAssessments.$inferInsert;
export type Recommendation = typeof recommendations.$inferSelect;
export type NewRecommendation = typeof recommendations.$inferInsert;
export type Achievement = typeof achievements.$inferSelect;
export type NewAchievement = typeof achievements.$inferInsert;
export type PatientAchievement = typeof patientAchievements.$inferSelect;
export type NewPatientAchievement = typeof patientAchievements.$inferInsert;
export type PatientStreak = typeof patientStreak.$inferSelect;
export type NewPatientStreak = typeof patientStreak.$inferInsert;

export const insertPatientSchema = createInsertSchema(patients);
export const selectPatientSchema = createSelectSchema(patients);
export const insertPatientDocumentSchema = createInsertSchema(patientDocuments);
export const selectPatientDocumentSchema = createSelectSchema(patientDocuments);
export const insertRiskAssessmentSchema = createInsertSchema(riskAssessments);
export const selectRiskAssessmentSchema = createSelectSchema(riskAssessments);
export const insertRecommendationSchema = createInsertSchema(recommendations);
export const selectRecommendationSchema = createSelectSchema(recommendations);
export const insertAchievementSchema = createInsertSchema(achievements);
export const selectAchievementSchema = createSelectSchema(achievements);
export const insertPatientAchievementSchema = createInsertSchema(patientAchievements);
export const selectPatientAchievementSchema = createSelectSchema(patientAchievements);
export const insertPatientStreakSchema = createInsertSchema(patientStreak);
export const selectPatientStreakSchema = createSelectSchema(patientStreak);