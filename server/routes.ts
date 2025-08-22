import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authService, authenticateToken } from "./auth";
import multer from "multer";
import path from "path";
import { 
  loginSchema, 
  registerSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema 
} from "@shared/schema";
import { getChatbotResponse, analyzeUserIntent, generateSpiritualInsight } from "./openai";
import { 
  insertJourneySchema, insertSageSchema, insertAshramSchema, 
  insertMeetupSchema, insertRegistrationSchema, insertBlogPostSchema,
  insertTestimonialSchema, insertContactMessageSchema, insertNewsletterSubscriberSchema,
  insertQuoteOfWeekSchema
} from "@shared/schema";
import { registerSEORoutes } from "./seo-routes";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Configure multer for file uploads
  const upload = multer({
    dest: 'attached_assets/',
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    }
  });

  // Journeys routes
  app.get("/api/journeys", async (req, res) => {
    try {
      const journeys = await storage.getJourneys();
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
      const sages = await storage.getSages();
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
      console.error("Error fetching sage:", error);
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
      const ashrams = await storage.getAshrams();
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
      console.error("Error fetching ashram:", error);
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
      const meetups = await storage.getMeetups();
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

  // Blog post routes
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error getting blog posts:", error);
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
      console.error("Error getting blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.get("/api/blog/slug/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const post = await storage.getBlogPostBySlug(slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error getting blog post by slug:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog", async (req, res) => {
    try {
      const postData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(postData);
      res.json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(400).json({ message: "Failed to create blog post" });
    }
  });

  // Testimonials routes
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Testimonials API error:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.get("/api/testimonials/featured", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      // Filter for featured testimonials
      const featured = testimonials.filter(t => t.featured);
      res.json(featured);
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

  // Quotes of the Week routes
  app.get("/api/quotes", async (req, res) => {
    try {
      const quotes = await storage.getQuotesOfWeek();
      res.json(quotes);
    } catch (error) {
      console.error("Quotes API error:", error);
      res.status(500).json({ message: "Failed to fetch quotes" });
    }
  });

  app.get("/api/quotes/active", async (req, res) => {
    try {
      const quotes = await storage.getActiveQuotesOfWeek();
      res.json(quotes);
    } catch (error) {
      console.error("Active quotes API error:", error);
      res.status(500).json({ message: "Failed to fetch active quotes" });
    }
  });

  app.post("/api/quotes", async (req, res) => {
    try {
      const validatedData = insertQuoteOfWeekSchema.parse(req.body);
      const quote = await storage.createQuoteOfWeek(validatedData);
      res.status(201).json(quote);
    } catch (error) {
      console.error("Create quote error:", error);
      res.status(400).json({ message: "Invalid quote data" });
    }
  });

  app.put("/api/quotes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const quote = await storage.updateQuoteOfWeek(id, updateData);
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      res.json(quote);
    } catch (error) {
      console.error("Update quote error:", error);
      res.status(400).json({ message: "Failed to update quote" });
    }
  });

  // Admin image upload route
  app.post("/api/admin/upload-quote-image", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const author = req.body.author || "unknown";
      const timestamp = Date.now();
      const fileExtension = path.extname(req.file.originalname);
      const newFilename = `${timestamp}_${author.replace(/\s+/g, '_')}${fileExtension}`;
      const newPath = path.join('attached_assets', newFilename);
      
      // Move and rename the uploaded file
      const fs = await import('fs/promises');
      await fs.rename(req.file.path, newPath);
      
      const imageUrl = `/attached_assets/${newFilename}`;
      res.json({ imageUrl });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to upload image" });
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

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await authService.register(validatedData);
      
      res.json({
        message: "Registration successful. Please check your email to verify your account.",
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          emailVerified: result.user.emailVerified,
        },
        token: result.token,
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(400).json({ 
        message: error.message || "Registration failed. Please try again." 
      });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await authService.login(validatedData);
      
      res.json({
        message: "Login successful",
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          emailVerified: result.user.emailVerified,
        },
        token: result.token,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(401).json({ 
        message: error.message || "Invalid credentials" 
      });
    }
  });

  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const validatedData = forgotPasswordSchema.parse(req.body);
      await authService.sendPasswordResetEmail(validatedData.email);
      
      res.json({
        message: "If an account with that email exists, we've sent password reset instructions.",
      });
    } catch (error: any) {
      console.error("Forgot password error:", error);
      res.status(500).json({ 
        message: "Failed to send reset email. Please try again." 
      });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const validatedData = resetPasswordSchema.parse(req.body);
      await authService.resetPassword(validatedData.token, validatedData.password);
      
      res.json({
        message: "Password reset successful. You can now login with your new password.",
      });
    } catch (error: any) {
      console.error("Reset password error:", error);
      res.status(400).json({ 
        message: error.message || "Password reset failed. Please try again." 
      });
    }
  });

  app.get("/api/auth/verify-email", async (req, res) => {
    try {
      const token = req.query.token as string;
      if (!token) {
        return res.status(400).json({ message: "Verification token required" });
      }

      await authService.verifyEmail(token);
      res.json({ message: "Email verified successfully" });
    } catch (error: any) {
      console.error("Email verification error:", error);
      res.status(400).json({ 
        message: error.message || "Email verification failed" 
      });
    }
  });

  app.get("/api/auth/user", authenticateToken, async (req: any, res) => {
    try {
      res.json({
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        emailVerified: req.user.emailVerified,
      });
    } catch (error: any) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to fetch user data" });
    }
  });

  // Enhanced newsletter subscription with verification
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const verificationToken = authService.generateVerificationToken();
      await storage.createNewsletterSubscriber(email, verificationToken);
      await authService.sendNewsletterVerificationEmail(email, verificationToken);

      res.json({ 
        message: "Please check your email to confirm your newsletter subscription." 
      });
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      res.status(500).json({ 
        message: "Failed to subscribe to newsletter. Please try again." 
      });
    }
  });

  app.get("/api/newsletter/verify", async (req, res) => {
    try {
      const token = req.query.token as string;
      if (!token) {
        return res.status(400).json({ message: "Verification token required" });
      }

      await storage.verifyNewsletterSubscriber(token);
      res.json({ message: "Newsletter subscription confirmed successfully" });
    } catch (error: any) {
      console.error("Newsletter verification error:", error);
      res.status(400).json({ 
        message: "Newsletter verification failed. Token may be invalid or expired." 
      });
    }
  });

  // Register SEO routes for sitemap.xml and robots.txt
  registerSEORoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
