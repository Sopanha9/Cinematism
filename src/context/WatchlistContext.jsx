import React, { createContext, useContext, useState, useEffect } from "react";

const WatchlistContext = createContext();

const WATCHLIST_KEY = "cinematism_watchlist";

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    if (stored) {
      try {
        setWatchlist(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse watchlist:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever watchlist changes
  useEffect(() => {
    if (isLoaded) {
      console.log("Saving watchlist to localStorage:", watchlist);
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    }
  }, [watchlist, isLoaded]);

  const getKey = (id, type) => `${type}-${id}`;

  const addToWatchlist = (item) => {
    const key = getKey(item.id, item.type || "movie");
    if (!watchlist.find((w) => getKey(w.id, w.type || "movie") === key)) {
      setWatchlist([
        ...watchlist,
        {
          ...item,
          addedAt: new Date().toISOString(),
        },
      ]);
    }
  };

  const removeFromWatchlist = (id, type = "movie") => {
    const key = getKey(id, type);
    setWatchlist(
      watchlist.filter((w) => getKey(w.id, w.type || "movie") !== key),
    );
  };

  const isInWatchlist = (id, type = "movie") => {
    const key = getKey(id, type);
    return watchlist.some((w) => getKey(w.id, w.type || "movie") === key);
  };

  const toggleWatchlist = (item) => {
    console.log("toggleWatchlist called with:", item);
    if (isInWatchlist(item.id, item.type || "movie")) {
      console.log("Removing from watchlist");
      removeFromWatchlist(item.id, item.type || "movie");
    } else {
      console.log("Adding to watchlist");
      addToWatchlist(item);
    }
  };

  const clearWatchlist = () => {
    setWatchlist([]);
  };

  const value = {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
    clearWatchlist,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within WatchlistProvider");
  }
  return context;
};
