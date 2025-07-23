import {
  users, journeys, sages, ashrams, meetups, registrations,
  blogPosts, testimonials, contactMessages, newsletterSubscribers, authUsers,
  type User, type InsertUser, type Journey, type InsertJourney,
  type Sage, type InsertSage, type Ashram, type InsertAshram,
  type Meetup, type InsertMeetup, type Registration, type InsertRegistration,
  type BlogPost, type InsertBlogPost, type Testimonial, type InsertTestimonial,
  type ContactMessage, type InsertContactMessage,
  type NewsletterSubscriber, type InsertNewsletterSubscriber,
  type AuthUser, type InsertAuthUser
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Journeys
  getAllJourneys(): Promise<Journey[]>;
  getJourney(id: number): Promise<Journey | undefined>;
  createJourney(journey: InsertJourney): Promise<Journey>;
  updateJourney(id: number, journey: Partial<InsertJourney>): Promise<Journey | undefined>;

  // Sages
  getAllSages(): Promise<Sage[]>;
  getSage(id: number): Promise<Sage | undefined>;
  createSage(sage: InsertSage): Promise<Sage>;
  updateSage(id: number, sage: Partial<InsertSage>): Promise<Sage | undefined>;

  // Ashrams
  getAllAshrams(): Promise<Ashram[]>;
  getAshram(id: number): Promise<Ashram | undefined>;
  createAshram(ashram: InsertAshram): Promise<Ashram>;
  updateAshram(id: number, ashram: Partial<InsertAshram>): Promise<Ashram | undefined>;

  // Meetups
  getAllMeetups(): Promise<Meetup[]>;
  getMeetup(id: number): Promise<Meetup | undefined>;
  createMeetup(meetup: InsertMeetup): Promise<Meetup>;
  registerForMeetup(registration: InsertRegistration): Promise<Registration>;

  // Blog
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;

  // Testimonials
  getAllTestimonials(): Promise<Testimonial[]>;
  getFeaturedTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;

  // Contact
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;

  // Newsletter
  subscribeNewsletter(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  
  // Authentication methods
  getAuthUser(id: number): Promise<AuthUser | undefined>;
  getAuthUserByEmail(email: string): Promise<AuthUser | undefined>;
  getAuthUserByVerificationToken(token: string): Promise<AuthUser | undefined>;
  getAuthUserByResetToken(token: string): Promise<AuthUser | undefined>;
  createAuthUser(userData: InsertAuthUser): Promise<AuthUser>;
  updateAuthUser(id: number, userData: Partial<InsertAuthUser>): Promise<AuthUser>;
  
  // Enhanced newsletter methods
  createNewsletterSubscriber(email: string, verificationToken: string): Promise<NewsletterSubscriber>;
  getNewsletterSubscriberByToken(token: string): Promise<NewsletterSubscriber | undefined>;
  verifyNewsletterSubscriber(token: string): Promise<NewsletterSubscriber>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private journeys: Map<number, Journey> = new Map();
  private sages: Map<number, Sage> = new Map();
  private ashrams: Map<number, Ashram> = new Map();
  private meetups: Map<number, Meetup> = new Map();
  private registrations: Map<number, Registration> = new Map();
  private blogPosts: Map<number, BlogPost> = new Map();
  private testimonials: Map<number, Testimonial> = new Map();
  private contactMessages: Map<number, ContactMessage> = new Map();
  private newsletterSubscribers: Map<number, NewsletterSubscriber> = new Map();
  
  private currentUserId = 1;
  private currentJourneyId = 1;
  private currentSageId = 1;
  private currentAshramId = 1;
  private currentMeetupId = 1;
  private currentRegistrationId = 1;
  private currentBlogPostId = 1;
  private currentTestimonialId = 1;
  private currentContactId = 1;
  private currentNewsletterSubscriberId = 1;

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // Seed journeys
    const journeyData = [
      {
        title: "Mindful Himalayas Retreat",
        description: "7-day transformative journey through sacred Himalayan monasteries and meditation centers",
        location: "Himalayas, Nepal",
        duration: "7 days",
        price: "$399 + expenses",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        inclusions: ["Accommodation", "Meditation sessions", "Local guide", "Traditional meals"],
        itinerary: "Day 1: Arrival and orientation...",
        available: true
      },
      {
        title: "Balinese Serenity Journey",
        description: "5-day immersion in traditional Balinese spiritual practices and temple ceremonies",
        location: "Ubud, Bali",
        duration: "5 days",
        price: "$299 + expenses",
        image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        inclusions: ["Temple visits", "Traditional ceremonies", "Yoga sessions", "Cultural experiences"],
        itinerary: "Day 1: Temple blessing ceremony...",
        available: true
      },
      {
        title: "Sacred India Pilgrimage",
        description: "10-day spiritual odyssey visiting ancient ashrams and holy sites across India",
        location: "Rishikesh, India",
        duration: "10 days",
        price: "$399 + expenses",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        inclusions: ["Ashram stays", "Spiritual teachings", "Sacred site visits", "Meditation practice"],
        itinerary: "Day 1: Arrival in Rishikesh...",
        available: true
      }
    ];

    journeyData.forEach(journey => {
      const id = this.currentJourneyId++;
      this.journeys.set(id, { ...journey, id });
    });

    // Seed sages
    const sageData = [
      {
        name: "Ramana Maharshi",
        description: "Self-realized sage who taught through silence and self-inquiry",
        biography: "Born in 1879, Ramana Maharshi was one of the most revered spiritual teachers of modern India...",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
        teachings: ["Self-inquiry", "Who am I?", "Silence as teaching"],
        books: ["Who Am I?", "Forty Verses on Reality"]
      },
      {
        name: "Sri Aurobindo",
        description: "Philosopher, yogi, and spiritual teacher who developed Integral Yoga",
        biography: "Sri Aurobindo was an Indian philosopher, yogi, maharishi, poet, and Indian nationalist...",
        image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
        teachings: ["Integral Yoga", "Evolution of consciousness", "Divine life"],
        books: ["The Life Divine", "Synthesis of Yoga"]
      },
      {
        name: "Anandamayi Ma",
        description: "Bengali Hindu saint who was revered as an incarnation of Hindu goddess Durga",
        biography: "Anandamayi Ma was a Hindu saint from Bengal. She was revered by her followers as an incarnation of the Divine Mother...",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
        teachings: ["Divine love", "Surrender to God", "Joy in spiritual practice"],
        books: ["Matri Vani", "Words of the Mother"]
      },
      {
        name: "Paramahansa Yogananda",
        description: "Yogi and guru who introduced millions to meditation and Kriya Yoga",
        biography: "Paramahansa Yogananda was an Indian Hindu monk, yogi and guru who introduced millions to the teachings of meditation...",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
        teachings: ["Kriya Yoga", "Self-realization", "East-West spiritual unity"],
        books: ["Autobiography of a Yogi", "The Science of Enlightenment"]
      }
    ];

    sageData.forEach(sage => {
      const id = this.currentSageId++;
      this.sages.set(id, { ...sage, id });
    });

    // Seed ashrams
    const ashramData = [
      {
        name: "Rishikesh Sacred Valley",
        location: "Rishikesh, India",
        description: "Ancient ashram nestled in the foothills of the Himalayas, offering traditional yoga and meditation practices",
        facilities: ["Meditation halls", "Yoga studios", "Vegetarian kitchen", "Library", "Gardens"],
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
        contact: "info@rishikeshashram.org",
        website: "www.rishikeshashram.org"
      },
      {
        name: "Himalayan Meditation Retreat",
        location: "Dharamshala, India",
        description: "Peaceful mountain retreat center focused on Buddhist meditation and mindfulness practices",
        facilities: ["Silent meditation halls", "Walking paths", "Organic gardens", "Guest quarters"],
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
        contact: "contact@himalayanretreat.org",
        website: "www.himalayanretreat.org"
      },
      {
        name: "Sacred Lotus Sanctuary",
        location: "Auroville, India",
        description: "Modern spiritual community dedicated to human unity and consciousness evolution",
        facilities: ["Matrimandir", "Study centers", "Cultural pavilions", "Workshops"],
        image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
        contact: "welcome@auroville.org",
        website: "www.auroville.org"
      },
      {
        name: "Mountain Wisdom Center",
        location: "McLeod Ganj, India",
        description: "Tibetan Buddhist center offering teachings in compassion and wisdom traditions",
        facilities: ["Prayer halls", "Study rooms", "Monastery", "Guest house"],
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
        contact: "info@mountainwisdom.org",
        website: "www.mountainwisdom.org"
      }
    ];

    ashramData.forEach(ashram => {
      const id = this.currentAshramId++;
      this.ashrams.set(id, { ...ashram, id });
    });

    // Seed testimonials
    const testimonialData = [
      {
        name: "Sarah Johnson",
        location: "California, USA",
        content: "The Himalayan retreat was life-changing. I found peace I never knew existed within myself.",
        rating: 5,
        journeyId: 1,
        featured: true
      },
      {
        name: "Marco Silva",
        location: "São Paulo, Brazil",
        content: "The spiritual guidance and community connection exceeded all my expectations.",
        rating: 5,
        journeyId: 2,
        featured: true
      }
    ];

    testimonialData.forEach(testimonial => {
      const id = this.currentTestimonialId++;
      this.testimonials.set(id, { ...testimonial, id });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Journey methods
  async getAllJourneys(): Promise<Journey[]> {
    return Array.from(this.journeys.values());
  }

  async getJourney(id: number): Promise<Journey | undefined> {
    return this.journeys.get(id);
  }

  async createJourney(journey: InsertJourney): Promise<Journey> {
    const id = this.currentJourneyId++;
    const newJourney: Journey = { ...journey, id };
    this.journeys.set(id, newJourney);
    return newJourney;
  }

  async updateJourney(id: number, journey: Partial<InsertJourney>): Promise<Journey | undefined> {
    const existing = this.journeys.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...journey };
    this.journeys.set(id, updated);
    return updated;
  }

  // Sage methods
  async getAllSages(): Promise<Sage[]> {
    return Array.from(this.sages.values());
  }

  async getSage(id: number): Promise<Sage | undefined> {
    return this.sages.get(id);
  }

  async createSage(sage: InsertSage): Promise<Sage> {
    const id = this.currentSageId++;
    const newSage: Sage = { ...sage, id };
    this.sages.set(id, newSage);
    return newSage;
  }

  async updateSage(id: number, sage: Partial<InsertSage>): Promise<Sage | undefined> {
    const existing = this.sages.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...sage };
    this.sages.set(id, updated);
    return updated;
  }

  // Ashram methods
  async getAllAshrams(): Promise<Ashram[]> {
    return Array.from(this.ashrams.values());
  }

  async getAshram(id: number): Promise<Ashram | undefined> {
    return this.ashrams.get(id);
  }

  async createAshram(ashram: InsertAshram): Promise<Ashram> {
    const id = this.currentAshramId++;
    const newAshram: Ashram = { ...ashram, id };
    this.ashrams.set(id, newAshram);
    return newAshram;
  }

  async updateAshram(id: number, ashram: Partial<InsertAshram>): Promise<Ashram | undefined> {
    const existing = this.ashrams.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...ashram };
    this.ashrams.set(id, updated);
    return updated;
  }

  // Meetup methods
  async getAllMeetups(): Promise<Meetup[]> {
    return Array.from(this.meetups.values());
  }

  async getMeetup(id: number): Promise<Meetup | undefined> {
    return this.meetups.get(id);
  }

  async createMeetup(meetup: InsertMeetup): Promise<Meetup> {
    const id = this.currentMeetupId++;
    const newMeetup: Meetup = { ...meetup, id };
    this.meetups.set(id, newMeetup);
    return newMeetup;
  }

  async registerForMeetup(registration: InsertRegistration): Promise<Registration> {
    const id = this.currentRegistrationId++;
    const newRegistration: Registration = { ...registration, id };
    this.registrations.set(id, newRegistration);
    return newRegistration;
  }

  // Blog methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).filter(post => post.published);
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentBlogPostId++;
    const newPost: BlogPost = { ...post, id, createdAt: new Date() };
    this.blogPosts.set(id, newPost);
    return newPost;
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existing = this.blogPosts.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...post };
    this.blogPosts.set(id, updated);
    return updated;
  }

  // Testimonial methods
  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values()).filter(t => t.featured);
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentTestimonialId++;
    const newTestimonial: Testimonial = { ...testimonial, id };
    this.testimonials.set(id, newTestimonial);
    return newTestimonial;
  }

  // Contact methods
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentContactId++;
    const newMessage: ContactMessage = { ...message, id, createdAt: new Date() };
    this.contactMessages.set(id, newMessage);
    return newMessage;
  }

  // Newsletter methods
  async subscribeNewsletter(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const id = this.currentNewsletterSubscriberId++;
    const newSubscriber: NewsletterSubscriber = { ...subscriber, id, subscribedAt: new Date() };
    this.newsletterSubscribers.set(id, newSubscriber);
    return newSubscriber;
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllJourneys(): Promise<Journey[]> {
    return await db.select().from(journeys);
  }

  async getJourney(id: number): Promise<Journey | undefined> {
    const [journey] = await db.select().from(journeys).where(eq(journeys.id, id));
    return journey || undefined;
  }

  async createJourney(journey: InsertJourney): Promise<Journey> {
    const [newJourney] = await db.insert(journeys).values(journey).returning();
    return newJourney;
  }

  async updateJourney(id: number, journey: Partial<InsertJourney>): Promise<Journey | undefined> {
    const [updated] = await db.update(journeys).set(journey).where(eq(journeys.id, id)).returning();
    return updated || undefined;
  }

  async getAllSages(): Promise<Sage[]> {
    return await db.select().from(sages);
  }

  async getSage(id: number): Promise<Sage | undefined> {
    const [sage] = await db.select().from(sages).where(eq(sages.id, id));
    return sage || undefined;
  }

  async createSage(sage: InsertSage): Promise<Sage> {
    const [newSage] = await db.insert(sages).values(sage).returning();
    return newSage;
  }

  async updateSage(id: number, sage: Partial<InsertSage>): Promise<Sage | undefined> {
    const [updated] = await db.update(sages).set(sage).where(eq(sages.id, id)).returning();
    return updated || undefined;
  }

  async getAllAshrams(): Promise<Ashram[]> {
    return await db.select().from(ashrams);
  }

  async getAshram(id: number): Promise<Ashram | undefined> {
    const [ashram] = await db.select().from(ashrams).where(eq(ashrams.id, id));
    return ashram || undefined;
  }

  async createAshram(ashram: InsertAshram): Promise<Ashram> {
    const [newAshram] = await db.insert(ashrams).values(ashram).returning();
    return newAshram;
  }

  async updateAshram(id: number, ashram: Partial<InsertAshram>): Promise<Ashram | undefined> {
    const [updated] = await db.update(ashrams).set(ashram).where(eq(ashrams.id, id)).returning();
    return updated || undefined;
  }

  async getAllMeetups(): Promise<Meetup[]> {
    return await db.select().from(meetups);
  }

  async getMeetup(id: number): Promise<Meetup | undefined> {
    const [meetup] = await db.select().from(meetups).where(eq(meetups.id, id));
    return meetup || undefined;
  }

  async createMeetup(meetup: InsertMeetup): Promise<Meetup> {
    const [newMeetup] = await db.insert(meetups).values(meetup).returning();
    return newMeetup;
  }

  async registerForMeetup(registration: InsertRegistration): Promise<Registration> {
    const [newRegistration] = await db.insert(registrations).values(registration).returning();
    return newRegistration;
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts);
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updated] = await db.update(blogPosts).set(post).where(eq(blogPosts.id, id)).returning();
    return updated || undefined;
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).where(eq(testimonials.featured, true));
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [newTestimonial] = await db.insert(testimonials).values(testimonial).returning();
    return newTestimonial;
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db.insert(contactMessages).values(message).returning();
    return newMessage;
  }

  async subscribeNewsletter(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const [newSubscriber] = await db.insert(newsletterSubscribers).values(subscriber).returning();
    return newSubscriber;
  }

  // Authentication user operations
  async getAuthUser(id: number): Promise<AuthUser | undefined> {
    const [user] = await db.select().from(authUsers).where(eq(authUsers.id, id));
    return user || undefined;
  }

  async getAuthUserByEmail(email: string): Promise<AuthUser | undefined> {
    const [user] = await db.select().from(authUsers).where(eq(authUsers.email, email));
    return user || undefined;
  }

  async getAuthUserByVerificationToken(token: string): Promise<AuthUser | undefined> {
    const [user] = await db.select().from(authUsers).where(eq(authUsers.emailVerificationToken, token));
    return user || undefined;
  }

  async getAuthUserByResetToken(token: string): Promise<AuthUser | undefined> {
    const [user] = await db.select().from(authUsers).where(eq(authUsers.passwordResetToken, token));
    return user || undefined;
  }

  async createAuthUser(userData: InsertAuthUser): Promise<AuthUser> {
    const [user] = await db.insert(authUsers).values(userData).returning();
    return user;
  }

  async updateAuthUser(id: number, userData: Partial<InsertAuthUser>): Promise<AuthUser> {
    const [user] = await db
      .update(authUsers)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(authUsers.id, id))
      .returning();
    return user;
  }

  // Enhanced newsletter operations with verification
  async createNewsletterSubscriber(email: string, verificationToken: string): Promise<NewsletterSubscriber> {
    const [subscriber] = await db
      .insert(newsletterSubscribers)
      .values({ email, verificationToken, verified: false })
      .returning();
    return subscriber;
  }

  async getNewsletterSubscriberByToken(token: string): Promise<NewsletterSubscriber | undefined> {
    const [subscriber] = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.verificationToken, token));
    return subscriber || undefined;
  }

  async verifyNewsletterSubscriber(token: string): Promise<NewsletterSubscriber> {
    const [subscriber] = await db
      .update(newsletterSubscribers)
      .set({ verified: true, verificationToken: null })
      .where(eq(newsletterSubscribers.verificationToken, token))
      .returning();
    return subscriber;
  }
}

export const storage = new DatabaseStorage();
