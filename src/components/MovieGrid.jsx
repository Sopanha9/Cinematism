import React from "react";
import MovieCard from "./MovieCard";
import { SkeletonMovieCard } from "./LoadingSpinner";

const MovieGrid = ({
  items = [],
  title,
  loading = false,
  loadingCount = 12,
}) => {
  return (
    <div className="py-8">
      {title && (
        <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-[--color-cinema-gold] pl-3">
          {title}
        </h2>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {loading
          ? Array.from({ length: loadingCount }).map((_, idx) => (
              <SkeletonMovieCard key={idx} />
            ))
          : items.map((item) => (
              <MovieCard
                key={item.id}
                id={item.id}
                title={item.title || item.name}
                posterPath={item.poster_path}
                rating={item.vote_average}
                releaseDate={item.release_date || item.first_air_date}
                type={item.type || (item.title ? "movie" : "tv")} // Use item.type if available, otherwise infer
              />
            ))}
      </div>

      {!loading && items.length === 0 && (
        <div className="text-center py-12 text-gray-400">No results found.</div>
      )}
    </div>
  );
};

export default MovieGrid;
