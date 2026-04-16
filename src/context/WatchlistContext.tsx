import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TMDBItem } from '../services/tmdb';

interface WatchlistItem extends TMDBItem {
  addedAt?: number;
}

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  isInWatchlist: (id: number, type: string) => boolean;
  toggleWatchlist: (item: WatchlistItem) => void;
  clearWatchlist: () => void;
}

const WatchlistContext = createContext<WatchlistContextType | null>(null);

export const WatchlistProvider = ({ children }: { children: ReactNode }) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('cinematism_watchlist') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cinematism_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const isInWatchlist = (id: number, type: string) =>
    watchlist.some((item) => item.id === id && item.type === type);

  const toggleWatchlist = (item: WatchlistItem) => {
    setWatchlist((prev) => {
      const exists = prev.some((i) => i.id === item.id && i.type === item.type);
      if (exists) return prev.filter((i) => !(i.id === item.id && i.type === item.type));
      return [...prev, { ...item, addedAt: Date.now() }];
    });
  };

  const clearWatchlist = () => setWatchlist([]);

  return (
    <WatchlistContext.Provider value={{ watchlist, isInWatchlist, toggleWatchlist, clearWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be used inside WatchlistProvider');
  return ctx;
};
