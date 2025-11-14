import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatStore {
  sessions: ChatSession[];
  currentSessionId: string | null;
  isLoading: boolean;
  isOpen: boolean;
  
  // Actions
  createNewSession: () => Promise<void>;
  loadSessions: () => Promise<void>;
  getCurrentSession: () => ChatSession | null;
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  deleteSession: (sessionId: string) => void;
  setCurrentSession: (sessionId: string) => void;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
}

const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,
      isLoading: false,
      isOpen: false,

      toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
      openChat: () => set({ isOpen: true }),
      closeChat: () => set({ isOpen: false }),

      createNewSession: async () => {
        const newSession: ChatSession = {
          id: crypto.randomUUID(),
          title: `Chat ${new Date().toLocaleDateString()}`,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          sessions: [newSession, ...state.sessions],
          currentSessionId: newSession.id,
        }));
      },

      loadSessions: async () => {
        set({ isLoading: true });
        // In a real app, this would load from an API
        // For now, we'll just use the persisted state
        set({ isLoading: false });
      },

      getCurrentSession: () => {
        const { sessions, currentSessionId } = get();
        return sessions.find(session => session.id === currentSessionId) || null;
      },

      addMessage: (content: string, role: 'user' | 'assistant') => {
        const { currentSessionId } = get();
        if (!currentSessionId) return;

        const newMessage: ChatMessage = {
          id: crypto.randomUUID(),
          content,
          role,
          timestamp: new Date(),
        };

        set((state) => ({
          sessions: state.sessions.map(session =>
            session.id === currentSessionId
              ? {
                  ...session,
                  messages: [...session.messages, newMessage],
                  updatedAt: new Date(),
                }
              : session
          ),
        }));
      },

      deleteSession: (sessionId: string) => {
        set((state) => ({
          sessions: state.sessions.filter(session => session.id !== sessionId),
          currentSessionId: state.currentSessionId === sessionId ? null : state.currentSessionId,
        }));
      },

      setCurrentSession: (sessionId: string) => {
        set({ currentSessionId: sessionId });
      },
    }),
    {
      name: 'chat-store',
      partialize: (state) => ({
        sessions: state.sessions,
        currentSessionId: state.currentSessionId,
      }),
    }
  )
);

export default useChatStore;
