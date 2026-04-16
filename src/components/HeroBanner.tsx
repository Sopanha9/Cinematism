import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Star } from 'lucide-react';
import { TMDBItem, TMDB_BACKDROP } from '../services/tmdb';

interface Props {
  items: TMDBItem[];
}

export default function HeroBanner({ items }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!items.length) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % Math.min(items.length, 5));
      setLoaded(false);
    }, 7000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (!items.length) {
    return <div className="h-screen bg-[#0a0a0a]" />;
  }

  const movie = items[activeIdx];
  const backdropUrl = movie.backdrop_path ? `${TMDB_BACKDROP}${movie.backdrop_path}` : '';
  const year = (movie.release_date || movie.first_air_date || '').substring(0, 4);
  const type = movie.type || movie.media_type || (movie.title ? 'movie' : 'tv');

  return (
    <div className="relative w-full h-screen min-h-[560px] overflow-hidden bg-[#0a0a0a]">
      {/* Backdrop */}
      {backdropUrl && (
        <img
          key={backdropUrl}
          src={backdropUrl}
          alt=""
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${loaded ? 'opacity-55' : 'opacity-0'}`}
        />
      )}
      {/* Gradients */}
      <div className="hero-gradient absolute inset-0" />
      <div className="hero-bottom-gradient absolute inset-x-0 bottom-0 h-64" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative h-full flex items-center max-w-[1400px] mx-auto px-6 sm:px-10">
        <div className="w-full max-w-2xl pt-20">
          {/* Genre badges */}
          <div className="flex items-center gap-2 mb-4 fade-in-up">
            <span className="bg-[#e50914] text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
              {type === 'tv' ? 'Series' : 'Movie'}
            </span>
            {year && (
              <span className="text-gray-400 text-sm font-medium">{year}</span>
            )}
            {movie.vote_average && movie.vote_average > 0 && (
              <span className="flex items-center gap-1 text-[#f5c518] text-sm font-semibold">
                <Star className="w-3.5 h-3.5 fill-current" />
                {movie.vote_average.toFixed(1)}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-white leading-none mb-4 fade-in-up fade-in-up-delay-1">
            {movie.title || movie.name}
          </h1>

          {/* Overview */}
          <p className="text-gray-300 text-base md:text-lg leading-relaxed line-clamp-3 mb-8 fade-in-up fade-in-up-delay-2 max-w-xl">
            {movie.overview}
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-3 fade-in-up fade-in-up-delay-3">
            <Link
              href={`/detail/${type}/${movie.id}`}
              className="flex items-center gap-2 bg-[#e50914] hover:bg-[#c40812] text-white font-bold px-7 py-3 rounded-md transition-colors text-sm"
            >
              <Play className="w-4 h-4 fill-current" />
              Watch Now
            </Link>
            <Link
              href={`/detail/${type}/${movie.id}`}
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white font-semibold px-7 py-3 rounded-md transition-colors border border-white/10 text-sm"
            >
              <Info className="w-4 h-4" />
              More Info
            </Link>
          </div>
        </div>
      </div>

      {/* Indicator dots */}
      {items.length > 1 && (
        <div className="absolute bottom-32 left-6 sm:left-10 flex gap-2">
          {items.slice(0, 5).map((_, i) => (
            <button
              key={i}
              onClick={() => { setActiveIdx(i); setLoaded(false); }}
              className={`h-1 rounded-full transition-all duration-300 ${i === activeIdx ? 'w-8 bg-[#e50914]' : 'w-2 bg-white/30 hover:bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
