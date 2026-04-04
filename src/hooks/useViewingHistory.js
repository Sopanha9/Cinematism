import { useState, useEffect } from "react";

const VIEWING_HISTORY_KEY = "cinematism_viewing_history";

export const useViewingHistory = () => {
  const [history, setHistory] = useState([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(VIEWING_HISTORY_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse viewing history:", e);
      }
    }
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    localStorage.setItem(VIEWING_HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const addToHistory = (item) => {
    const key = `${item.type || "movie"}-${item.id}`;

    // Remove if already exists (to move to top)
    const filtered = history.filter(
      (h) => `${h.type || "movie"}-${h.id}` !== key,
    );

    // Add to beginning with timestamp
    setHistory(
      [
        {
          ...item,
          viewedAt: new Date().toISOString(),
        },
        ...filtered,
      ].slice(0, 50),
    ); // Keep only last 50 items
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const getHistory = () => history;

  return {
    history,
    addToHistory,
    clearHistory,
    getHistory,
  };
};
