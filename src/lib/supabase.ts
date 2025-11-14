import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

// Create a single Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Sets the authentication token for the Supabase client.
 * This should be called after the user logs in with Firebase.
 * @param {string} token The Firebase ID token.
 */
export const setSupabaseAuth = (token: string | null) => {
  if (token) {
    supabase.auth.setSession({ access_token: token, refresh_token: '' });
  } else {
    supabase.auth.signOut();
  }
};

// Helper function to sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Subscribe to auth state changes
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  return subscription.unsubscribe;
};
