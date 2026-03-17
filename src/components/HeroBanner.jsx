import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Info } from 'lucide-react';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/original';

const HeroBanner = ({ movie }) => {
  if (!movie) return null;

  const backdropUrl = movie.backdrop_path 
    ? `${TMDB_IMAGE_BASE}${movie.backdrop_path}`
    : '';

  return (
    <div className="relative w-full h-[70vh] md:h-[80vh] bg-[--color-cinema-darker]">
      <div className="absolute inset-0">
        <img 
          src={backdropUrl} 
          alt={movie.title || movie.name}
          className="w-full h-full object-cover object-top opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[--color-cinema-darker] via-[--color-cinema-darker]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[--color-cinema-darker] via-[--color-cinema-darker]/80 to-transparent w-full md:w-2/3"></div>
      </div>

      <div className="relative h-full flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full md:w-2/3 lg:w-1/2 pt-20">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-glow leading-tight">
            {movie.title || movie.name}
          </h1>
          
          <div className="flex items-center space-x-4 mb-6 text-sm md:text-base font-medium">
            <span className="text-[--color-cinema-accent] flex items-center">
              ★ {movie.vote_average?.toFixed(1)} Rating
            </span>
            <span className="text-gray-300">
              {movie.release_date?.substring(0, 4) || movie.first_air_date?.substring(0, 4)}
            </span>
          </div>
          
          <p className="text-gray-300 text-base md:text-lg mb-8 line-clamp-3 md:line-clamp-4">
            {movie.overview}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to={`/detail/${movie.title ? 'movie' : 'tv'}/${movie.id}`}
              className="px-6 py-3 bg-[--color-cinema-gold] hover:bg-[--color-cinema-gold-hover] text-black font-bold rounded-full flex items-center justify-center transition-colors"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Trailer
            </Link>
            <Link 
              to={`/detail/${movie.title ? 'movie' : 'tv'}/${movie.id}`}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-bold rounded-full flex items-center justify-center transition-colors"
            >
              <Info className="w-5 h-5 mr-2" />
              More Info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
