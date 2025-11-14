import { create } from 'zustand';
import { onAuthChange, signOutUser } from '../lib/firebase';
import { setSupabaseAuth } from '../lib/supabase';
import type { User } from 'firebase/auth';

interface Profile {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  // Add other profile fields as needed
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialize: () => void;
  logout: () => Promise<void>;
  setProfile: (profile: Profile) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: () => {
    set({ isLoading: true });
    
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        // Here you would typically fetch the user's profile from your database
        // For now, we'll create a basic profile from the user object
        const profile: Profile = {
          id: user.uid,
          email: user.email || '',
          name: user.displayName || user.email?.split('@')[0] || 'User',
          role: 'user' // Default role
        };
        
        const token = await user.getIdToken();
        setSupabaseAuth(token);

        set({
          user,
          profile,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setSupabaseAuth(null);
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    });

    // Return the unsubscribe function for cleanup
    return () => {
      // @ts-ignore - The type definition for onAuthStateChanged doesn't include the returned unsubscribe function
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  },

  setProfile: (profile: Profile) => set({ profile }),

  logout: async () => {
    try {
      await signOutUser();
      set({ 
        user: null, 
        profile: null, 
        isAuthenticated: false 
      });
    } catch (error) {
      console.error('Logout failed', error);
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      throw new Error(errorMessage);
    }
  },
}));

export default useAuthStore;