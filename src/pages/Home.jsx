import React, { useState, useEffect } from "react";
import HeroBanner from "../components/HeroBanner";
import MovieGrid from "../components/MovieGrid";
import {
  getPopular,
  getTVShows,
  getAnimeShows,
  getTrending,
} from "../services/tmdb";

const MAX_TMDB_PAGES = 500;

// Ensure items have proper type field for consistency
const ensureType = (items, defaultType = "movie") => {
  return (items || []).map((item) => ({
    ...item,
    type:
      item.type ||
      item.media_type ||
      (item.title ? "movie" : "tv") ||
      defaultType,
  }));
};

const getVisiblePages = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const rawPages = [
    1,
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2,
    totalPages,
  ]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const uniquePages = [...new Set(rawPages)];
  const visiblePages = [];

  uniquePages.forEach((page, index) => {
    if (index > 0 && page - uniquePages[index - 1] > 1) {
      visiblePages.push(`ellipsis-${index}`);
    }
    visiblePages.push(page);
  });

  return visiblePages;
};

const Home = ({ mode = "home" }) => {
  const [primaryItems, setPrimaryItems] = useState([]);
  const [secondaryItems, setSecondaryItems] = useState([]);
  const [trendingItems, setTrendingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const isPagedMode = mode !== "home";

  useEffect(() => {
    setCurrentPage(1);
  }, [mode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (mode === "home") {
          const [moviesData, tvData, trendingData] = await Promise.all([
            getPopular("movie", 1),
            getTVShows(1),
            getTrending("movie", "week"),
          ]);

          setPrimaryItems(ensureType(moviesData.results, "movie"));
          setSecondaryItems(ensureType(tvData.results, "tv"));
          setTrendingItems(ensureType(trendingData.results, "movie"));
          setTotalPages(1);
          return;
        }

        const fetchMap = {
          movies: () => getPopular("movie", currentPage),
          tv: () => getTVShows(currentPage),
          anime: () => getAnimeShows(currentPage),
        };

        const fetchCategory = fetchMap[mode] || fetchMap.movies;
        const response = await fetchCategory();
        const defaultType =
          mode === "tv" ? "tv" : mode === "anime" ? "tv" : "movie";
        setPrimaryItems(ensureType(response.results, defaultType));
        setSecondaryItems([]);
        setTrendingItems([]);
        setTotalPages(Math.min(response.total_pages || 1, MAX_TMDB_PAGES));
      } catch (err) {
        console.error("Error fetching home data:", err);
        setError("Failed to load content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mode, currentPage]);

  if (error) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="bg-red-900/50 border border-red-500 text-white p-6 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  const featuredItem = primaryItems.length > 0 ? primaryItems[0] : null;
  const gridPrimaryItems =
    primaryItems.length > 0
      ? mode === "home"
        ? primaryItems.slice(1, 11)
        : primaryItems
      : [];
  const gridSecondaryItems =
    secondaryItems.length > 0 ? secondaryItems.slice(0, 10) : [];
  const titleByMode = {
    movies: "Trending Movies",
    tv: "Popular TV Shows",
    anime: "Popular Anime",
  };
  const primaryTitle = titleByMode[mode] || "Trending Movies";
  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="min-h-screen pb-16">
      {loading ? (
        <div className="h-[70vh] bg-[--color-cinema-gray] animate-pulse"></div>
      ) : (
        <HeroBanner movie={featuredItem} />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <MovieGrid
          items={gridPrimaryItems}
          title={primaryTitle}
          loading={loading}
          loadingCount={10}
        />

        {mode === "home" && (
          <>
            <MovieGrid
              items={gridSecondaryItems}
              title="Popular TV Shows"
              loading={loading}
              loadingCount={10}
            />
            <MovieGrid
              items={trendingItems.slice(0, 10)}
              title="Trending This Week"
              loading={loading}
              loadingCount={10}
            />
          </>
        )}

        {isPagedMode && !loading && totalPages > 1 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-md border border-white/20 bg-black/30 text-sm font-medium text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:border-cinema-gold hover:text-cinema-gold transition-colors"
            >
              Prev
            </button>

            {visiblePages.map((item) =>
              typeof item === "string" ? (
                <span key={item} className="px-2 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => setCurrentPage(item)}
                  className={`px-3 py-2 rounded-md border text-sm font-semibold transition-colors ${
                    item === currentPage
                      ? "bg-cinema-gold text-black border-cinema-gold"
                      : "bg-black/30 text-gray-200 border-white/20 hover:border-cinema-gold hover:text-cinema-gold"
                  }`}
                >
                  {item}
                </button>
              ),
            )}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-md border border-white/20 bg-black/30 text-sm font-medium text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:border-cinema-gold hover:text-cinema-gold transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
