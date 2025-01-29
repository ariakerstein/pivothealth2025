import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { patients, diagnosticTests, recommendations, testOrders, patientDocuments, riskAssessments, achievements, patientAchievements, patientStreak, users, waitlist, insertWaitlistSchema } from "@db/schema";
import { eq, sql } from "drizzle-orm";
import multer from "multer";
import { encryptBuffer, decryptBuffer } from "./utils/encryption";
import { setupAuth } from "./auth";

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

export function registerRoutes(app: Express): Server {
  // Add waitlist endpoint
  app.post("/api/waitlist", async (req, res) => {
    try {
      const result = insertWaitlistSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          error: "Invalid email address: " + result.error.issues.map(i => i.message).join(", ") 
        });
      }

      const { email } = result.data;

      // Check if email already exists
      const [existingEmail] = await db
        .select()
        .from(waitlist)
        .where(eq(waitlist.email, email))
        .limit(1);

      if (existingEmail) {
        return res.status(400).json({ error: "Email already registered" });
      }

      // Store email in database
      const [newEntry] = await db
        .insert(waitlist)
        .values({ email })
        .returning();

      console.log('Waitlist signup:', email);
      res.json({ status: "success", message: "Added to waitlist" });
    } catch (error) {
      console.error('Waitlist error:', error);
      res.status(500).json({ error: "Failed to join waitlist" });
    }
  });

  // sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // put application routes here
  // prefix all routes with /api
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
      const { messages } = req.body;

      // Validate input
      if (!Array.isArray(messages)) {
        return res.status(400).json({ 
          error: "Invalid request format",
          message: "Messages must be an array"
        });
      }

      // Create message array with medical context and ensure proper alternation
      const systemMessage = {
        role: "system",
        content: `You are a knowledgeable medical Co-Pilot assistant focused on cancer care. 
        Provide accurate, evidence-based information while being empathetic. 
        Always cite sources when possible. If unsure, acknowledge limitations and 
        recommend consulting healthcare providers.

        Important Guidelines:
        - Be clear about being an AI Co-Pilot
        - Provide evidence-based information from reputable medical sources
        - Show empathy while maintaining professionalism
        - Encourage consultation with healthcare providers for specific medical advice
        - Focus on general information and support
        - When discussing treatments, reference standard protocols
        - For symptom management, provide general, safe recommendations`
      };

      // Start with system message
      let formattedMessages = [systemMessage];

      // Add the last message if it's from user, or the last two messages if they alternate properly
      const userMessages = messages.filter(m => m.role === "user");
      const lastMessage = userMessages[userMessages.length - 1];

      if (lastMessage) {
        // If we have a previous assistant message before the last user message, include it
        const prevAssistantMessage = messages
          .slice(0, -1)
          .reverse()
          .find(m => m.role === "assistant");

        if (prevAssistantMessage) {
          formattedMessages.push(prevAssistantMessage);
        }

        formattedMessages.push(lastMessage);
      }

      // Send request to Perplexity API
      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-small-128k-online",
          messages: formattedMessages,
          temperature: 0.2,
          max_tokens: 2048,
          search_domain_filter: ["nih.gov", "cancer.gov", "who.int", "mayoclinic.org", "cancer.org"],
          return_citations: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        console.error('Perplexity API error:', errorData);
        throw new Error(errorData.error?.message || response.statusText);
      }

      const data = await response.json();

      // Format response with citations
      const messageContent = data.choices[0].message.content;
      const citations = data.citations || [];

      // Add medical disclaimer if not present
      const disclaimer = "Note: This AI Co-Pilot provides general information and support but is not a substitute for professional medical advice. Always consult with your healthcare provider for medical decisions.";
      const finalMessage = messageContent.includes("not a substitute") 
        ? messageContent 
        : `${messageContent}\n\n${disclaimer}`;

      res.json({ 
        message: finalMessage,
        citations: citations
      });
    } catch (error) {
      console.error('Chat API error:', error);
      res.status(500).json({
        error: "Failed to process chat message",
        message: "Our health Co-Pilot is temporarily unavailable. Please try again later."
      });
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

  // New dashboard routes
  app.get("/api/patient/activities", async (_req, res) => {
    try {
      // For now, we'll combine activities from different sources
      const [documents, orders] = await Promise.all([
        db.select().from(patientDocuments).limit(5),
        db.select().from(testOrders).limit(5),
      ]);

      const activities = [
        ...documents.map(doc => ({
          id: doc.id,
          type: 'document',
          description: `Uploaded document: ${doc.filename}`,
          timestamp: doc.uploadedAt.toISOString(),
        })),
        ...orders.map(order => ({
          id: order.id,
          type: 'test_order',
          description: `Ordered test #${order.testId}`,
          timestamp: order.orderedAt.toISOString(),
        })),
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  app.get("/api/patient/engagement-metrics", async (_req, res) => {
    try {
      const [
        documentCount,
        testOrderCount,
        recommendationCount,
      ] = await Promise.all([
        db.select().from(patientDocuments).limit(1000),
        db.select().from(testOrders).limit(1000),
        db.select().from(recommendations).limit(1000),
      ]);

      res.json({
        documentUploads: documentCount.length,
        testOrders: testOrderCount.length,
        chatInteractions: 5, // Placeholder
        recommendationsViewed: recommendationCount.length,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch engagement metrics" });
    }
  });

  // Risk Assessment endpoints
  app.post("/api/risk-assessment", async (req, res) => {
    try {
      const riskFactors = req.body;
      const riskScore = calculateRiskScore(riskFactors);

      const [assessment] = await db
        .insert(riskAssessments)
        .values({
          patientId: 1, // TODO: Get from auth
          assessmentDate: new Date(),
          riskFactors,
          riskScore,
          notes: generateRiskNotes(riskScore),
        })
        .returning();

      res.json(assessment);
    } catch (error) {
      res.status(500).json({ error: "Failed to create risk assessment" });
    }
  });

  app.get("/api/risk-assessment/history", async (_req, res) => {
    try {
      const assessments = await db
        .select()
        .from(riskAssessments)
        .orderBy(riskAssessments.assessmentDate);

      res.json(assessments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch risk assessment history" });
    }
  });

  app.get("/api/risk-assessment/latest", async (_req, res) => {
    try {
      const [latest] = await db
        .select()
        .from(riskAssessments)
        .orderBy(riskAssessments.assessmentDate)
        .limit(1);

      res.json(latest || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch latest risk assessment" });
    }
  });

  // Helper function to generate risk notes
  function generateRiskNotes(score: number): string {
    if (score >= 80) {
      return "High risk - Immediate consultation recommended";
    } else if (score >= 60) {
      return "Elevated risk - Schedule follow-up within 1 month";
    } else if (score >= 40) {
      return "Moderate risk - Regular monitoring advised";
    } else {
      return "Low risk - Continue routine screening";
    }
  }

  // Recommendation Engine endpoints
  app.post("/api/recommendations/generate", async (req, res) => {
    try {
      const patientId = 1; // TODO: Get from auth

      // Fetch latest risk assessment
      const [latestRisk] = await db
        .select()
        .from(riskAssessments)
        .where(eq(riskAssessments.patientId, patientId))
        .orderBy(riskAssessments.assessmentDate)
        .limit(1);

      // Generate recommendations based on risk factors
      const newRecommendations = [];

      if (latestRisk) {
        const { riskFactors, riskScore } = latestRisk;

        // High PSA Level recommendations
        if (riskFactors.psaLevel > 4) {
          newRecommendations.push({
            patientId,
            title: "Schedule Urologist Consultation",
            description: "Your PSA levels are above normal range. A urologist can perform additional tests and provide expert evaluation.",
            category: "Screening",
            priority: "High",
            actionItems: [
              "Schedule appointment with urologist within 2 weeks",
              "Prepare list of current medications and symptoms",
              "Bring recent PSA test results to appointment",
              "Write down any questions you have about elevated PSA levels"
            ],
            suggestedTests: [{
              testId: 1, // Assuming this is the ID for PSA test
              reason: "Monitor PSA levels closely"
            }],
            supportingData: [{
              type: "PSA",
              value: riskFactors.psaLevel,
              context: "Above normal range"
            }],
            status: "active"
          });
        }

        // Age-based recommendations
        if (riskFactors.age >= 50) {
          newRecommendations.push({
            patientId,
            title: "Regular Prostate Cancer Screening",
            description: "Based on your age, regular prostate cancer screening is recommended. Let's set up your screening schedule.",
            category: "Prevention",
            priority: "Medium",
            actionItems: [
              "Schedule annual PSA test",
              "Discuss screening schedule with primary care physician",
              "Learn about prostate health and prevention strategies",
              "Set reminders for future screenings"
            ],
            status: "active"
          });
        }

        // Lifestyle recommendations
        if (riskFactors.otherConditions.includes("obesity")) {
          newRecommendations.push({
            patientId,
            title: "Lifestyle Modifications",
            description: "Our health coach can help you develop a personalized plan for maintaining a healthy weight and lifestyle.",
            category: "Lifestyle",
            priority: "Medium",
            actionItems: [
              "Chat with our health coach to create a personalized plan",
              "Start regular exercise routine",
              "Monitor weight weekly",
              "Track daily physical activity"
            ],
            status: "active"
          });
        }

        // High risk score recommendations
        if (riskScore >= 60) {
          newRecommendations.push({
            patientId,
            title: "Comprehensive Health Evaluation",
            description: "Your risk assessment suggests the need for a thorough health evaluation. Let's schedule this important check-up.",
            category: "Screening",
            priority: "High",
            actionItems: [
              "Schedule comprehensive health check-up",
              "Complete recommended screening tests",
              "Follow up with specialist referrals",
              "Discuss risk factors with your healthcare provider"
            ],
            status: "active"
          });
        }

        // Family history recommendations
        if (riskFactors.familyHistory) {
          newRecommendations.push({
            patientId,
            title: "Genetic Counseling Consultation",
            description: "Given your family history, speaking with a genetic counselor can provide valuable insights about your health risks.",
            category: "Screening",
            priority: "Medium",
            actionItems: [
              "Schedule genetic counseling appointment",
              "Gather detailed family medical history",
              "Prepare questions about hereditary risks",
              "Discuss preventive measures based on family history"
            ],
            status: "active"
          });
        }
      }

      // Insert new recommendations
      const createdRecommendations = await db
        .insert(recommendations)
        .values(newRecommendations)
        .returning();

      res.json(createdRecommendations);
    } catch (error) {
      console.error('Recommendation generation error:', error);
      res.status(500).json({ error: "Failed to generate recommendations" });
    }
  });

  app.get("/api/recommendations/active", async (_req, res) => {
    try {
      const activeRecommendations = await db
        .select()
        .from(recommendations)
        .where(eq(recommendations.status, "active"))
        .orderBy(recommendations.createdAt);

      res.json(activeRecommendations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  });

  // Achievement endpoints
  app.get("/api/achievements", async (_req, res) => {
    try {
      const patientId = 1; // TODO: Get from auth
      const [allAchievements, unlockedAchievements] = await Promise.all([
        db.select().from(achievements),
        db.select().from(patientAchievements).where(eq(patientAchievements.patientId, patientId)),
      ]);

      const achievementsWithProgress = allAchievements.map(achievement => {
        const unlockedAchievement = unlockedAchievements.find(
          ua => ua.achievementId === achievement.id
        );

        return {
          ...achievement,
          progress: unlockedAchievement?.progress || 0,
          isUnlocked: !!unlockedAchievement,
        };
      });

      res.json(achievementsWithProgress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch achievements" });
    }
  });

  app.get("/api/streak", async (_req, res) => {
    try {
      const patientId = 1; // TODO: Get from auth
      const [streak] = await db
        .select()
        .from(patientStreak)
        .where(eq(patientStreak.patientId, patientId))
        .limit(1);

      if (!streak || !streak.lastActivityDate) {
        return res.json({ currentStreak: 0 });
      }

      // Check if streak is still valid (no more than 1 day gap)
      const lastActivity = new Date(streak.lastActivityDate);
      const today = new Date();
      const daysSinceLastActivity = Math.floor(
        (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceLastActivity > 1) {
        // Reset streak
        await db
          .update(patientStreak)
          .set({
            currentStreak: 0,
            lastActivityDate: sql`CURRENT_DATE`,
            streakStartDate: sql`CURRENT_DATE`,
          })
          .where(eq(patientStreak.id, streak.id));

        return res.json({ currentStreak: 0 });
      }

      res.json({ currentStreak: streak.currentStreak });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch streak" });
    }
  });

  // Update the recommendation status endpoint to handle achievements and streaks
  app.post("/api/recommendations/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const patientId = 1; // TODO: Get from auth
      const recommendationId = parseInt(req.params.id);

      // Update recommendation status
      const [updated] = await db
        .update(recommendations)
        .set({
          status,
          completedAt: status === "completed" ? sql`CURRENT_TIMESTAMP` : null,
          updatedAt: sql`CURRENT_TIMESTAMP`
        })
        .where(eq(recommendations.id, recommendationId))
        .returning();

      if (status === "completed") {
        // Update streak
        const today = new Date();
        const [currentStreak] = await db
          .select()
          .from(patientStreak)
          .where(eq(patientStreak.patientId, patientId))
          .limit(1);

        if (currentStreak && currentStreak.lastActivityDate) {
          const daysSinceLastActivity = Math.floor(
            (today.getTime() - new Date(currentStreak.lastActivityDate).getTime()) / (1000 * 60 * 60 * 24)
          );

          if (daysSinceLastActivity <= 1) {
            // Continue streak
            await db
              .update(patientStreak)
              .set({
                currentStreak: currentStreak.currentStreak + 1,
                longestStreak: sql`GREATEST(longest_streak, ${currentStreak.currentStreak + 1})`,
                lastActivityDate: sql`CURRENT_DATE`,
              })
              .where(eq(patientStreak.id, currentStreak.id));
          } else {
            // Reset streak
            await db
              .update(patientStreak)
              .set({
                currentStreak: 1,
                lastActivityDate: sql`CURRENT_DATE`,
                streakStartDate: sql`CURRENT_DATE`,
              })
              .where(eq(patientStreak.id, currentStreak.id));
          }
        } else {
          // Create first streak
          await db.insert(patientStreak).values({
            patientId,
            currentStreak: 1,
            longestStreak: 1,
            lastActivityDate: sql`CURRENT_DATE`,
            streakStartDate: sql`CURRENT_DATE`,
          });
        }

        // Check and update achievements
        const recommendationAchievements = await db
          .select()
          .from(achievements)
          .where(
            sql`requirement->>'type' = 'recommendation_completion'`
          );

        for (const achievement of recommendationAchievements) {
          const target = achievement.requirement.target;
          const [existing] = await db
            .select()
            .from(patientAchievements)
            .where(
              eq(patientAchievements.achievementId, achievement.id)
            )
            .limit(1);

          if (!existing) {
            await db.insert(patientAchievements).values({
              patientId,
              achievementId: achievement.id,
              progress: Math.min((1 / target) * 100, 100),
            });
          } else {
            const newProgress = Math.min(
              ((existing.progress / 100) * target + 1) / target * 100,
              100
            );
            await db
              .update(patientAchievements)
              .set({ progress: newProgress })
              .where(eq(patientAchievements.id, existing.id));
          }
        }
      }

      res.json(updated);
    } catch (error) {
      console.error('Status update error:', error);
      res.status(500).json({ error: "Failed to update recommendation status" });
    }
  });

  // Community endpoints with sample data
  app.get("/api/community/similar-patients", (_req, res) => {
    const samplePatients = [
      {
        id: 1,
        name: "Sarah M.",
        cancerType: "Breast Cancer",
        stage: "II",
        treatmentPhase: "Post-Surgery Recovery",
        interests: ["Nutrition", "Exercise", "Mindfulness"],
        matchScore: 92
      },
      {
        id: 2,
        name: "James H.",
        cancerType: "Lung Cancer",
        stage: "I",
        treatmentPhase: "Chemotherapy",
        interests: ["Support Groups", "Clinical Trials", "Alternative Therapy"],
        matchScore: 85
      },
      {
        id: 3,
        name: "Maria R.",
        cancerType: "Breast Cancer",
        stage: "III",
        treatmentPhase: "Radiation Therapy",
        interests: ["Lifestyle Changes", "Diet", "Meditation"],
        matchScore: 78
      }
    ];
    res.json(samplePatients);
  });

  app.get("/api/community/discussions", (_req, res) => {
    const sampleDiscussions = [
      {
        id: 1,
        title: "Tips for Managing Chemo Side Effects",
        author: "Emily S.",
        replies: 24,
        lastActivity: "2 hours ago",
        tags: ["Chemotherapy", "Side Effects", "Wellness"]
      },
      {
        id: 2,
        title: "Success Story: 5 Years Cancer-Free",
        author: "Michael P.",
        replies: 45,
        lastActivity: "1 day ago",
        tags: ["Success Story", "Inspiration", "Recovery"]
      },
      {
        id: 3,
        title: "New Clinical Trial Opportunities",
        author: "Dr. Roberts",
        replies: 18,
        lastActivity: "3 hours ago",
        tags: ["Clinical Trials", "Research", "Treatment Options"]
      }
    ];
    res.json(sampleDiscussions);
  });

  app.get("/api/mentor/profile", (_req, res) => {
    const sampleProfile = {
      id: 1,
      name: "David Wilson",
      expertise: ["Breast Cancer", "Chemotherapy", "Emotional Support"],
      story: "Survived stage II breast cancer, completed treatment in 2022",
      yearsOfExperience: 2,
      menteesCount: 5,
      rating: 4.8
    };
    res.json(sampleProfile);
  });

  app.get("/api/mentor/mentees", (_req, res) => {
    const sampleMentees = [
      {
        id: 1,
        name: "Rachel K.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel",
        diagnosis: "Breast Cancer",
        stage: "II",
        status: "Active"
      },
      {
        id: 2,
        name: "Thomas B.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas",
        diagnosis: "Lung Cancer",
        stage: "I",
        status: "Weekly Check-in"
      }
    ];
    res.json(sampleMentees);
  });

  app.get("/api/mentor/requests", (_req, res) => {
    const sampleRequests = [
      {
        id: 1,
        name: "Lisa M.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
        diagnosis: "Breast Cancer",
        stage: "I",
        message: "Looking for guidance on managing anxiety during treatment",
        status: "Pending"
      },
      {
        id: 2,
        name: "John D.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        diagnosis: "Prostate Cancer",
        stage: "II",
        message: "Need advice on treatment options and lifestyle changes",
        status: "Pending"
      }
    ];
    res.json(sampleRequests);
  });

  // Add avatar update endpoint
  app.post("/api/user/avatar", async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).send("Not authenticated");
      }

      const { avatarUrl } = req.body;
      if (!avatarUrl) {
        return res.status(400).send("Avatar URL is required");
      }

      const [updatedUser] = await db
        .update(users)
        .set({ avatarUrl })
        .where(eq(users.id, req.user.id))
        .returning();

      res.json(updatedUser);
    } catch (error) {
      console.error('Avatar update error:', error);
      res.status(500).json({ error: "Failed to update avatar" });
    }
  });


  const httpServer = createServer(app);
  return httpServer;
}

function calculateRiskScore(riskFactors: any): number {
  // Implement your risk score calculation logic here
  return 0; // Placeholder
}