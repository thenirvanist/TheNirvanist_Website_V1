import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
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
  category: text("category").notNull(),
  image: text("image"),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
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
  subscribedAt: timestamp("subscribed_at").defaultNow(),
});

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
