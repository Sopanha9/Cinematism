import React from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import MovieCard from '../components/MovieCard';

export default function Watchlist() {
  const { watchlist, clearWatchlist } = useWatchlist();

  const normalized = watchlist.map((item) => ({
    ...item,
    poster_path: item.poster_path || (item as any).posterPath,
    release_date: item.release_date || (item as any).releaseDate,
    first_air_date: item.first_air_date || (item as any).releaseDate,
    vote_average: item.vote_average || (item as any).rating,
  }));

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Heart className="w-7 h-7 fill-[#e50914] text-[#e50914]" />
            <h1 className="font-display text-4xl sm:text-5xl text-white">My Watchlist</h1>
          </div>
          {watchlist.length > 0 && (
            <button
              onClick={() => { if (confirm('Clear all watchlist items?')) clearWatchlist(); }}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#e50914] transition-colors border border-white/10 hover:border-[#e50914] px-4 py-2 rounded-md"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Heart className="w-20 h-20 text-gray-700 mb-4" />
            <h2 className="font-display text-3xl text-white mb-2">Nothing Saved Yet</h2>
            <p className="text-gray-500">Click the heart icon on any movie or show to save it here.</p>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-6">{watchlist.length} item{watchlist.length !== 1 ? 's' : ''} saved</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {normalized.map((item) => <MovieCard key={`${item.id}-${item.type}`} item={item} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
