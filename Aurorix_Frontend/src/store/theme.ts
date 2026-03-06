import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemeMode, Language } from "@/type";

interface ThemeState {
  mode: ThemeMode;
  language: Language;
  sidebarCollapsed: boolean;

  // Actions
  setMode: (mode: ThemeMode) => void;
  setLanguage: (language: Language) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Computed
  isDark: () => boolean;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "system",
      language: "en",
      sidebarCollapsed: false,

      setMode: (mode) => {
        set({ mode });
        applyTheme(mode);
      },

      setLanguage: (language) => {
        set({ language });
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
      },

      isDark: () => {
        const { mode } = get();
        if (mode === "dark") return true;
        if (mode === "light") return false;
        // System preference
        if (typeof window !== "undefined") {
          return window.matchMedia("(prefers-color-scheme: dark)").matches;
        }
        return false;
      },
    }),
    {
      name: "aurorix-theme",
    }
  )
);

// Apply theme to document
function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  if (mode === "dark") {
    root.classList.add("dark");
  } else if (mode === "light") {
    root.classList.remove("dark");
  } else {
    // System preference
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }
}

// Initialize theme on load
if (typeof window !== "undefined") {
  const storedMode = localStorage.getItem("aurorix-theme");
  if (storedMode) {
    try {
      const parsed = JSON.parse(storedMode);
      if (parsed.state?.mode) {
        applyTheme(parsed.state.mode);
      }
    } catch {
      applyTheme("system");
    }
  }

  // Listen for system theme changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    const currentMode = useThemeStore.getState().mode;
    if (currentMode === "system") {
      applyTheme("system");
    }
  });
}
