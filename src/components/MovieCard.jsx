import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const FALLBACK_POSTER = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750">
    <rect width="500" height="750" fill="#111111"/>
    <rect x="20" y="20" width="460" height="710" rx="20" fill="#1a1a1a" stroke="#2f2f2f"/>
    <text x="250" y="355" text-anchor="middle" fill="#d4af37" font-size="22" font-family="Arial, sans-serif">Poster Unavailable</text>
    <text x="250" y="390" text-anchor="middle" fill="#9ca3af" font-size="15" font-family="Arial, sans-serif">Image not provided by source</text>
  </svg>`,
)}`;

const MovieCard = ({
  id,
  title,
  posterPath,
  rating,
  type = "movie",
  releaseDate,
}) => {
  const imageUrl = posterPath
    ? `${TMDB_IMAGE_BASE}${posterPath}`
    : FALLBACK_POSTER;

  // Extract year
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "";

  return (
    <Link to={`/detail/${type}/${id}`} className="block group">
      <div className="bg-[--color-cinema-gray] rounded-xl overflow-hidden card-hover relative aspect-[2/3]">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:opacity-75"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_POSTER;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="text-white font-bold text-lg leading-tight mb-1">
            {title}
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-300">
            <span>{year}</span>
            <div className="flex items-center text-[--color-cinema-accent]">
              <Star className="w-4 h-4 fill-current mr-1" />
              <span>{rating?.toFixed(1) || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
