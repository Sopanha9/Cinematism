import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MovieGrid from "../components/MovieGrid";
import { searchMulti, getSimilar } from "../services/tmdb";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const [results, setResults] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;

      try {
        setLoading(true);
        setError(null);
        setSimilarMovies([]);

        const data = await searchMulti(query);
        const safeResults = (data.results || [])
          .filter((item) => item?.id && (item.title || item.name))
          .map((item) => ({
            ...item,
            type: item.media_type, // Ensure type is set for routing
          }));
        setResults(safeResults);

        // Fetch similar movies for the first result
        if (safeResults.length > 0) {
          const firstResult = safeResults[0];
          try {
            setLoadingSimilar(true);
            const similarData = await getSimilar(
              firstResult.id,
              firstResult.type,
            );
            const similarResults = (similarData.results || [])
              .filter((item) => item?.id && (item.title || item.name))
              .slice(0, 10) // Limit to 10 similar items
              .map((item) => ({
                ...item,
                type: item.media_type || firstResult.type,
              }));
            setSimilarMovies(similarResults);
          } catch (err) {
            console.error("Error fetching similar movies:", err);
            // Don't show error if similar movies fail - it's not critical
          } finally {
            setLoadingSimilar(false);
          }
        }
      } catch (err) {
        console.error("Error searching:", err);
        setError("Failed to search. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!query ? (
          <div className="max-w-2xl mx-auto mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <h2 className="text-2xl font-bold text-white">
              Search for a movie or TV show
            </h2>
            <p className="mt-3 text-gray-400">
              Type a title in the search bar to see results.
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-900/50 border border-red-500 text-white p-6 rounded-lg mt-8 text-center">
            {error}
          </div>
        ) : !loading && results.length === 0 ? (
          <div className="max-w-2xl mx-auto mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <h2 className="text-2xl font-bold text-white">No results found</h2>
            <p className="mt-3 text-gray-400">
              We could not find a clean result for "{query}". Try a different
              keyword.
            </p>
          </div>
        ) : (
          <>
            <MovieGrid
              items={results}
              title={`Search Results for "${query}"`}
              loading={loading}
            />

            {similarMovies.length > 0 && (
              <div className="mt-12">
                <MovieGrid
                  items={similarMovies}
                  title={`Similar to "${results[0]?.title || results[0]?.name}"`}
                  loading={loadingSimilar}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
