"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "light" | "dark" | "system";
type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage or default to system
  const [theme, setTheme] = useState<Theme>("system");
  // Tracks the actual theme being applied (light or dark)
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
      setTheme(savedTheme);
    }

    // Apply the theme to document
    applyTheme(savedTheme || "system");
  }, []);

  // Handle system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (theme === "system") {
        const newTheme = mediaQuery.matches ? "dark" : "light";
        setResolvedTheme(newTheme);
        document.documentElement.classList.toggle("dark-theme", mediaQuery.matches);
      }
    };
    
    // Initial check
    handleChange();
    
    // Listen for changes
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Apply theme when theme state changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const applyTheme = (currentTheme: Theme) => {
    if (currentTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      document.documentElement.classList.toggle("dark-theme", systemTheme === "dark");
      setResolvedTheme(systemTheme);
    } else {
      document.documentElement.classList.toggle("dark-theme", currentTheme === "dark");
      setResolvedTheme(currentTheme);
    }
    
    // Save to localStorage
    localStorage.setItem("theme", currentTheme);
  };

  const value = {
    theme,
    setTheme,
    resolvedTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}