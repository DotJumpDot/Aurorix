import { create } from "zustand";
import { session } from "@/service/http";
import { userService } from "@/service/user";
import type { User } from "@/type";

// Type guard for User
function isValidUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "email" in obj &&
    "username" in obj &&
    "created_at" in obj &&
    typeof (obj as Record<string, unknown>).id === "string" &&
    typeof (obj as Record<string, unknown>).email === "string"
  );
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  checkAuth: async () => {
    if (!session.isAuthenticated()) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    set({ isLoading: true });

    try {
      const user = session.getUser<User>();
      if (isValidUser(user)) {
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        // Try to fetch profile
        const profile = await userService.getProfile();
        if (profile) {
          session.setUser(profile);
          set({ user: profile, isAuthenticated: true, isLoading: false });
        } else {
          session.clear();
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      }
    } catch {
      session.clear();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },
}));
