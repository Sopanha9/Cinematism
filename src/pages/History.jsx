import React from "react";
import { useViewingHistory } from "../hooks/useViewingHistory";
import MovieGrid from "../components/MovieGrid";
import { Clock } from "lucide-react";

const History = () => {
  const { history, clearHistory } = useViewingHistory();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-[--color-cinema-gold]" />
            <h1 className="text-4xl font-bold text-white">Recently Viewed</h1>
          </div>
          {history.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Clear all viewing history?")) {
                  clearHistory();
                }
              }}
              className="px-4 py-2 rounded-full border border-white/20 bg-black/30 text-sm font-medium text-gray-200 hover:border-[--color-cinema-gold] hover:text-[--color-cinema-gold] transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="max-w-2xl mx-auto mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-white">
              No viewing history
            </h2>
            <p className="mt-3 text-gray-400">
              Start watching movies and shows to see them here!
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-400 mb-6">
              {history.length} item{history.length !== 1 ? "s" : ""} viewed
            </p>
            <div className="space-y-6">
              {/* Timeline view with recent items grouped by date */}
              {history.map((item) => (
                <div key={`${item.type}-${item.id}`} className="group">
                  <div className="flex gap-4 items-start pb-4 border-b border-gray-800 last:border-0">
                    {/* Poster */}
                    <div className="w-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-700 hover:border-[--color-cinema-gold] transition-colors">
                      <img
                        src={
                          item.posterPath
                            ? `https://image.tmdb.org/t/p/w200${item.posterPath}`
                            : "https://via.placeholder.com/100x150?text=No+Image"
                        }
                        alt={item.title}
                        className="w-full h-36 object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white group-hover:text-[--color-cinema-gold] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {item.type === "tv" ? "TV Show" : "Movie"} •{" "}
                        {item.releaseDate
                          ? new Date(item.releaseDate).getFullYear()
                          : "N/A"}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        {item.rating && (
                          <div className="flex items-center text-sm text-[--color-cinema-accent]">
                            <span className="text-sm">
                              ⭐ {item.rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                        <span className="text-xs text-gray-500">
                          Viewed {formatDate(item.viewedAt)}
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    <a
                      href={`/detail/${item.type}/${item.id}`}
                      className="px-4 py-2 rounded-full bg-[--color-cinema-gold] text-black font-semibold text-sm hover:brightness-110 transition-all self-center whitespace-nowrap"
                    >
                      Watch Again
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default History;
