import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Play } from 'lucide-react';
import { TMDBItem, TMDB_IMG } from '../services/tmdb';
import { useWatchlist } from '../context/WatchlistContext';

interface Props {
  item: TMDBItem;
  rank?: number; // for Top 10
}

const FALLBACK = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300"><rect width="200" height="300" fill="#1a1a1a"/><text x="100" y="155" text-anchor="middle" fill="#444" font-size="12" font-family="sans-serif">No Image</text></svg>`
)}`;

export default function MovieCard({ item, rank }: Props) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const type = item.type || item.media_type || (item.title ? 'movie' : 'tv');
  const title = item.title || item.name || '';
  const year = (item.release_date || item.first_air_date || '').substring(0, 4);
  const inWL = isInWatchlist(item.id, type);
  const posterUrl = item.poster_path ? `${TMDB_IMG}${item.poster_path}` : FALLBACK;

  const handleWL = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist({ ...item, type });
  };

  return (
    <div className={`relative flex-shrink-0 group ${rank !== undefined ? 'flex items-end' : ''}`}>
      {/* Top 10 number */}
      {rank !== undefined && (
        <span className="top10-number select-none leading-none mr-[-10px] z-10 relative" style={{ fontSize: '5.5rem' }}>
          {rank}
        </span>
      )}

      <Link href={`/detail/${type}/${item.id}`} className={`block relative overflow-hidden rounded-md bg-[#141414] movie-card ${rank !== undefined ? 'w-[120px] sm:w-[140px] flex-shrink-0' : 'w-full'}`} style={{ aspectRatio: '2/3' }}>
        <img
          src={posterUrl}
          alt={title}
          loading="lazy"
          className="card-img w-full h-full object-cover transition-transform duration-300"
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
        />

        {/* Overlay */}
        <div className="card-overlay absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-0 transition-opacity duration-200 flex flex-col justify-end p-3">
          <p className="text-white font-semibold text-sm leading-tight line-clamp-2 mb-1">{title}</p>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs">{year}</span>
            {item.vote_average && item.vote_average > 0 && (
              <span className="flex items-center gap-0.5 text-[#f5c518] text-xs font-bold">
                <Star className="w-3 h-3 fill-current" />
                {item.vote_average.toFixed(1)}
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="flex items-center gap-1 text-white text-xs bg-[#e50914] px-2 py-1 rounded font-semibold">
              <Play className="w-3 h-3 fill-current" /> Play
            </span>
          </div>
        </div>

        {/* Rating badge */}
        {item.vote_average && item.vote_average > 0 && (
          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded px-1.5 py-0.5 flex items-center gap-0.5 group-hover:opacity-0 transition-opacity">
            <Star className="w-2.5 h-2.5 fill-[#f5c518] text-[#f5c518]" />
            <span className="text-[#f5c518] text-[10px] font-bold">{item.vote_average.toFixed(1)}</span>
          </div>
        )}

        {/* Watchlist btn */}
        <button
          onClick={handleWL}
          className={`absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 transition-all ${inWL ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          <Heart className={`w-3.5 h-3.5 transition-colors ${inWL ? 'fill-[#e50914] text-[#e50914]' : 'text-white'}`} />
        </button>
      </Link>
    </div>
  );
}
