import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getChatbotResponse, analyzeUserIntent, generateSpiritualInsight } from "./openai";
import { 
  insertJourneySchema, insertSageSchema, insertAshramSchema, 
  insertMeetupSchema, insertRegistrationSchema, insertBlogPostSchema,
  insertTestimonialSchema, insertContactMessageSchema, insertNewsletterSubscriberSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Journeys routes
  app.get("/api/journeys", async (req, res) => {
    try {
      const journeys = await storage.getAllJourneys();
      res.json(journeys);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch journeys" });
    }
  });

  app.get("/api/journeys/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const journey = await storage.getJourney(id);
      if (!journey) {
        return res.status(404).json({ message: "Journey not found" });
      }
      res.json(journey);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch journey" });
    }
  });

  app.post("/api/journeys", async (req, res) => {
    try {
      const validatedData = insertJourneySchema.parse(req.body);
      const journey = await storage.createJourney(validatedData);
      res.status(201).json(journey);
    } catch (error) {
      res.status(400).json({ message: "Invalid journey data" });
    }
  });

  // Sages routes
  app.get("/api/sages", async (req, res) => {
    try {
      const sages = await storage.getAllSages();
      res.json(sages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sages" });
    }
  });

  app.get("/api/sages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const sage = await storage.getSage(id);
      if (!sage) {
        return res.status(404).json({ message: "Sage not found" });
      }
      res.json(sage);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sage" });
    }
  });

  app.post("/api/sages", async (req, res) => {
    try {
      const validatedData = insertSageSchema.parse(req.body);
      const sage = await storage.createSage(validatedData);
      res.status(201).json(sage);
    } catch (error) {
      res.status(400).json({ message: "Invalid sage data" });
    }
  });

  // Ashrams routes
  app.get("/api/ashrams", async (req, res) => {
    try {
      const ashrams = await storage.getAllAshrams();
      res.json(ashrams);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ashrams" });
    }
  });

  app.get("/api/ashrams/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const ashram = await storage.getAshram(id);
      if (!ashram) {
        return res.status(404).json({ message: "Ashram not found" });
      }
      res.json(ashram);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ashram" });
    }
  });

  app.post("/api/ashrams", async (req, res) => {
    try {
      const validatedData = insertAshramSchema.parse(req.body);
      const ashram = await storage.createAshram(validatedData);
      res.status(201).json(ashram);
    } catch (error) {
      res.status(400).json({ message: "Invalid ashram data" });
    }
  });

  // Meetups routes
  app.get("/api/meetups", async (req, res) => {
    try {
      const meetups = await storage.getAllMeetups();
      res.json(meetups);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch meetups" });
    }
  });

  app.post("/api/meetups/register", async (req, res) => {
    try {
      const validatedData = insertRegistrationSchema.parse(req.body);
      const registration = await storage.registerForMeetup(validatedData);
      res.status(201).json(registration);
    } catch (error) {
      res.status(400).json({ message: "Failed to register for meetup" });
    }
  });

  // Blog routes
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getBlogPost(id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog", async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid blog post data" });
    }
  });

  // Testimonials routes
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.get("/api/testimonials/featured", async (req, res) => {
    try {
      const testimonials = await storage.getFeaturedTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured testimonials" });
    }
  });

  app.post("/api/testimonials", async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.status(201).json(testimonial);
    } catch (error) {
      res.status(400).json({ message: "Invalid testimonial data" });
    }
  });

  // Contact routes
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: "Failed to send contact message" });
    }
  });

  // Newsletter routes
  app.post("/api/newsletter", async (req, res) => {
    try {
      const validatedData = insertNewsletterSubscriberSchema.parse(req.body);
      const subscriber = await storage.subscribeNewsletter(validatedData);
      res.status(201).json(subscriber);
    } catch (error) {
      res.status(400).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  // AI Chatbot routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const response = await getChatbotResponse(message, history || []);
      res.json(response);
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ 
        message: "I'm experiencing a moment of silence. Please try again.", 
        intent: "general_info",
        confidence: 0.5 
      });
    }
  });

  app.post("/api/chat/analyze", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const analysis = await analyzeUserIntent(message);
      res.json(analysis);
    } catch (error) {
      console.error("Intent analysis error:", error);
      res.status(500).json({ 
        intent: "general_info", 
        entities: [], 
        confidence: 0.5 
      });
    }
  });

  app.post("/api/spiritual-insight", async (req, res) => {
    try {
      const { topic } = req.body;
      
      if (!topic) {
        return res.status(400).json({ message: "Topic is required" });
      }

      const insight = await generateSpiritualInsight(topic);
      res.json({ insight });
    } catch (error) {
      console.error("Spiritual insight error:", error);
      res.status(500).json({ 
        insight: "In every moment, there is an opportunity for deeper understanding." 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
