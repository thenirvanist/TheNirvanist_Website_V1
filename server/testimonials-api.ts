import { db } from "./db";
import { testimonials } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function getAllTestimonials() {
  try {
    const result = await db.select({
      id: testimonials.id,
      name: testimonials.name,
      location: testimonials.location,
      content: testimonials.content,
      rating: testimonials.rating,
      journeyTitle: testimonials.journeyTitle,
      avatar: testimonials.avatar,
      featured: testimonials.featured,
      createdAt: testimonials.createdAt
    }).from(testimonials);
    return result;
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    throw error;
  }
}

export async function getFeaturedTestimonials() {
  try {
    const result = await db.select({
      id: testimonials.id,
      name: testimonials.name,
      location: testimonials.location,
      content: testimonials.content,
      rating: testimonials.rating,
      journeyTitle: testimonials.journeyTitle,
      avatar: testimonials.avatar,
      featured: testimonials.featured,
      createdAt: testimonials.createdAt
    }).from(testimonials).where(eq(testimonials.featured, true));
    return result;
  } catch (error) {
    console.error("Error fetching featured testimonials:", error);
    throw error;
  }
}