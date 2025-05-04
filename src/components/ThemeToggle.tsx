"use client";
import React from "react";

export default function ThemeToggle() {
  // Default to light mode
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  const [dark, setDark] = React.useState(false);
  React.useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);
  return (
    <button
      className="fixed top-4 right-4 z-50 px-3 py-1 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
      onClick={() => setDark((d) => !d)}
      aria-label="Toggle light/dark mode"
    >
      {dark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
} 