import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// These environment variables should be set in your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  );
}

/**
 * Supabase client instance
 * 
 * This client is configured to work with authentication, database operations,
 * and real-time subscriptions. It automatically handles JWT tokens and 
 * session management.
 * 
 * Usage examples:
 * - Authentication: supabase.auth.signInWithOAuth()
 * - Database: supabase.from('table').select()
 * - Storage: supabase.storage.from('bucket')
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Automatically refresh tokens
    autoRefreshToken: true,
    // Persist auth session in localStorage
    persistSession: true,
    // Detect auth changes and update accordingly
    detectSessionInUrl: true,
  },
});

/**
 * Auth helper functions
 */
export const authHelpers = {
  /**
   * Get the current user session
   */
  getCurrentSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  /**
   * Get the current user
   */
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  /**
   * Sign out the current user
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: async (): Promise<boolean> => {
    const session = await authHelpers.getCurrentSession();
    return !!session;
  },
};

export default supabase;