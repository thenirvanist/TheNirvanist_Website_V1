import { pgTable, text, serial, integer, boolean, timestamp, jsonb, date, varchar, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const journeys = pgTable("journeys", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  fullDescription: text("full_description"),
  location: text("location").notNull(),
  duration: text("duration").notNull(),
  price: text("price").notNull(),
  image: text("image").notNull(),
  heroImage: text("hero_image"),
  inclusions: text("inclusions").array(),
  itinerary: text("itinerary"),
  overview: text("overview"),
  available: boolean("available").default(true),
});

export const sages = pgTable("sages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  biography: text("biography").notNull(),
  image: text("image").notNull(),
  location: text("location"),
  teachings: text("teachings").array(),
  books: text("books").array(),
  coreTeachings: text("core_teachings").array(),
  notableWork: text("notable_work").array(),
  category: text("category"), // Hindu, Buddhist, Sufi, Jain, etc.
  era: text("era"), // Ancient, Modern
  status: text("status"), // Living, Deceased
});

export const ashrams = pgTable("ashrams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  facilities: text("facilities").array(),
  image: text("image").notNull(),
  contact: text("contact"),
  website: text("website"),
  region: text("region"), // North India, South India, West India, East India, Central India
  focus: text("focus"), // Meditation, Yoga, Service, Self-inquiry, etc.
  founders: text("founders"), // Name of founder/spiritual leader
});

export const meetups = pgTable("meetups", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  duration: text("duration").notNull(),
  maxParticipants: integer("max_participants").default(8),
  registeredCount: integer("registered_count").default(0),
});

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  country: text("country").notNull(),
  timezone: text("timezone").notNull(),
  interestedInTravel: boolean("interested_in_travel").default(false),
  meetupId: integer("meetup_id"),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  author: text("author").notNull(),
  category: text("category").notNull().default("Inner Nutrition"),
  image: text("image").notNull(),
  bannerImage: text("banner_image"),
  slug: text("slug").notNull().unique(),
  readTime: text("read_time").default("5 min read"),
  tags: text("tags").array(),
  published: boolean("published").default(true),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  journeyTitle: text("journey_title"),
  avatar: text("avatar"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  verified: boolean("verified").default(false),
  verificationToken: text("verification_token"),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
});

export const quotesOfWeek = pgTable("quotes_of_week", {
  id: serial("id").primaryKey(),
  dayOfWeek: integer("day_of_week").notNull(), // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  title: text("title").notNull(),
  author: text("author").notNull(),
  quoteText: text("quote_text"),
  imageUrl: text("image_url").notNull(),
  active: boolean("active").default(true),
  weekStartDate: date("week_start_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Authentication tables
export const authUsers = pgTable("auth_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // hashed
  firstName: text("first_name"),
  lastName: text("last_name"),
  emailVerified: boolean("email_verified").default(false),
  emailVerificationToken: text("email_verification_token"),
  passwordResetToken: text("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bookmarks table for user bookmarking functionality
export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  contentType: varchar("content_type", { length: 50 }).notNull(), // 'sage', 'ashram', 'blog', 'journey'
  contentId: integer("content_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  // Ensure a user can only bookmark the same content once
  uniqueBookmark: unique().on(table.userId, table.contentType, table.contentId),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertJourneySchema = createInsertSchema(journeys).omit({ id: true });
export const insertSageSchema = createInsertSchema(sages).omit({ id: true });
export const insertAshramSchema = createInsertSchema(ashrams).omit({ id: true });
export const insertMeetupSchema = createInsertSchema(meetups).omit({ id: true });
export const insertRegistrationSchema = createInsertSchema(registrations).omit({ id: true });
export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({ id: true, createdAt: true });
export const insertTestimonialSchema = createInsertSchema(testimonials).omit({ id: true });
export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({ id: true, createdAt: true });
export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).omit({ id: true, subscribedAt: true });
export const insertQuoteOfWeekSchema = createInsertSchema(quotesOfWeek).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAuthUserSchema = createInsertSchema(authUsers).omit({ id: true, createdAt: true, updatedAt: true });
export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({ id: true, createdAt: true });

// Login and authentication schemas
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Journey = typeof journeys.$inferSelect;
export type InsertJourney = z.infer<typeof insertJourneySchema>;
export type Sage = typeof sages.$inferSelect;
export type InsertSage = z.infer<typeof insertSageSchema>;
export type Ashram = typeof ashrams.$inferSelect;
export type InsertAshram = z.infer<typeof insertAshramSchema>;
export type Meetup = typeof meetups.$inferSelect;
export type InsertMeetup = z.infer<typeof insertMeetupSchema>;
export type Registration = typeof registrations.$inferSelect;
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;
export type QuoteOfWeek = typeof quotesOfWeek.$inferSelect;
export type InsertQuoteOfWeek = z.infer<typeof insertQuoteOfWeekSchema>;
export type AuthUser = typeof authUsers.$inferSelect;
export type InsertAuthUser = z.infer<typeof insertAuthUserSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
export type Bookmark = typeof bookmarks.$inferSelect;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
