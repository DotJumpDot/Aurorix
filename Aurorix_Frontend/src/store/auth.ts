import { create } from "zustand";
import { session } from "@/service/http";
import { authService } from "@/service/auth";
import { useUserStore } from "./user";
import type { LoginCredentials, RegisterCredentials } from "@/type";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authService.login(credentials);

      if (response.success && response.data) {
        // Store session using Starveil
        session.setToken(response.data.token);
        session.setUser(response.data.user);

        // Also update user store
        useUserStore.getState().setUser(response.data.user);

        set({
          isAuthenticated: true,
          isLoading: false,
        });

        return true;
      }

      set({
        error: response.message,
        isLoading: false,
      });

      return false;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      set({
        error: message,
        isLoading: false,
      });
      return false;
    }
  },

  register: async (credentials) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authService.register(credentials);

      if (response.success && response.data) {
        // Auto-login after registration
        session.setToken(response.data.token);
        session.setUser(response.data.user);

        // Also update user store
        useUserStore.getState().setUser(response.data.user);

        set({
          isAuthenticated: true,
          isLoading: false,
        });

        return true;
      }

      set({
        error: response.message,
        isLoading: false,
      });

      return false;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
      set({
        error: message,
        isLoading: false,
      });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });

    try {
      await authService.logout();
    } catch {
      // Continue with logout even if API fails
    }

    // Clear session
    session.clear();

    // Also clear user store
    useUserStore.getState().setUser(null);

    set({
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));
