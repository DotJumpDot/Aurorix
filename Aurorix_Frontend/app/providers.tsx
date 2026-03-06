"use client";

import { useEffect } from "react";
import { ConfigProvider, theme as antTheme, App as AntApp } from "antd";
import { useThemeStore } from "@/store/theme";
import { lightTheme } from "@/theme/lightTheme";
import { darkTheme } from "@/theme/darkTheme";
import "@/language/i18n";

export function Providers({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeStore();

  // Determine if dark mode is active
  const isDark =
    mode === "dark" ||
    (mode === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    // Apply theme class to document
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: isDark ? darkTheme.token : lightTheme.token,
        components: isDark ? darkTheme.components : lightTheme.components,
      }}
    >
      <AntApp>{children}</AntApp>
    </ConfigProvider>
  );
}
