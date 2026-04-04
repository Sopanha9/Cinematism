import React from "react";
import { useWatchlist } from "../context/WatchlistContext";
import MovieGrid from "../components/MovieGrid";
import { Heart } from "lucide-react";

const Watchlist = () => {
  const { watchlist, clearWatchlist } = useWatchlist();

  // Normalize items to have snake_case properties for MovieGrid
  const normalizedItems = watchlist.map((item) => ({
    ...item,
    poster_path: item.poster_path || item.posterPath,
    release_date: item.release_date || item.releaseDate,
    first_air_date: item.first_air_date || item.releaseDate,
    vote_average: item.vote_average || item.rating,
  }));

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 fill-red-500 text-red-500" />
            <h1 className="text-4xl font-bold text-white">My Watchlist</h1>
          </div>
          {watchlist.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Clear all items from your watchlist?")) {
                  clearWatchlist();
                }
              }}
              className="px-4 py-2 rounded-full border border-white/20 bg-black/30 text-sm font-medium text-gray-200 hover:border-red-500 hover:text-red-500 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {watchlist.length === 0 ? (
          <div className="max-w-2xl mx-auto mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-white">
              No items in watchlist
            </h2>
            <p className="mt-3 text-gray-400">
              Add movies or shows to your watchlist by clicking the heart icon!
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-400 mb-6">
              {watchlist.length} item{watchlist.length !== 1 ? "s" : ""} saved
            </p>
            <MovieGrid
              items={normalizedItems}
              title="Saved Items"
              loading={false}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
