import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Journey, Sage, Ashram, Meetup, Testimonial, DailyWisdom } from "@shared/schema";

/**
 * Direct Supabase query hooks that bypass backend API
 * These hooks use the Supabase client with anon key and respect RLS policies
 * Perfect for Netlify deployment where serverless functions may have issues
 */

export function useJourneys() {
  return useQuery<Journey[]>({
    queryKey: ["supabase", "journeys"],
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase not configured");
      const { data, error } = await supabase
        .from("journeys")
        .select("*")
        .order("id", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useJourney(id: number) {
  return useQuery<Journey>({
    queryKey: ["supabase", "journeys", id],
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase not configured");
      const { data, error } = await supabase
        .from("journeys")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSages() {
  return useQuery<Sage[]>({
    queryKey: ["supabase", "sages"],
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase not configured");
      const { data, error } = await supabase
        .from("sages")
        .select("*")
        .order("id", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useSage(id: number) {
  return useQuery<Sage>({
    queryKey: ["supabase", "sages", id],
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase not configured");
      const { data, error } = await supabase
        .from("sages")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAshrams() {
  return useQuery<Ashram[]>({
    queryKey: ["supabase", "ashrams"],
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase not configured");
      const { data, error } = await supabase
        .from("ashrams")
        .select("*")
        .order("id", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAshram(id: number) {
  return useQuery<Ashram>({
    queryKey: ["supabase", "ashrams", id],
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase not configured");
      const { data, error } = await supabase
        .from("ashrams")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMeetups() {
  return useQuery<Meetup[]>({
    queryKey: ["supabase", "meetups"],
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase not configured");
      const { data, error } = await supabase
        .from("meetups")
        .select("*")
        .order("id", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useTestimonials() {
  return useQuery<Testimonial[]>({
    queryKey: ["supabase", "testimonials"],
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase not configured");
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("id", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useActiveQuotes() {
  return useQuery<DailyWisdom[]>({
    queryKey: ["supabase", "daily_wisdom", "active"],
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase not configured");
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from("daily_wisdom")
        .select("*")
        .eq("active", true)
        .lte("display_date", today)
        .order("display_date", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}
