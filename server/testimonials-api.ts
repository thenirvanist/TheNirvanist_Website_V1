import { db } from "./db";
import { testimonials } from "@shared/schema";

export async function getAllTestimonials() {
  try {
    const result = await db.select().from(testimonials);
    return result;
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    throw error;
  }
}

export async function getFeaturedTestimonials() {
  try {
    const result = await db.select().from(testimonials).where(testimonials.featured);
    return result;
  } catch (error) {
    console.error("Error fetching featured testimonials:", error);
    throw error;
  }
}