import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import { TMDBItem } from '../services/tmdb';

interface Props {
  title: string;
  items: TMDBItem[];
  loading?: boolean;
  top10?: boolean;
}

const SkeletonCard = () => (
  <div className="flex-shrink-0 w-[140px] sm:w-[160px] rounded-md overflow-hidden" style={{ aspectRatio: '2/3' }}>
    <div className="skeleton w-full h-full" />
  </div>
);

export default function Carousel({ title, items, loading = false, top10 = false }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const scroll = (dir: 'left' | 'right') => {
    const el = rowRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  const onScroll = () => {
    const el = rowRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 10);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  return (
    <div className="py-6 relative group/section">
      {/* Title */}
      <h2 className="section-title font-display text-2xl sm:text-3xl text-white mb-4 flex items-center tracking-wide">
        {title}
      </h2>

      {/* Row */}
      <div className="relative">
        {/* Left arrow */}
        {showLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-2 w-10 h-10 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-white hover:bg-[#e50914] hover:border-[#e50914] transition-all shadow-xl"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Right arrow */}
        {showRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-2 w-10 h-10 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-white hover:bg-[#e50914] hover:border-[#e50914] transition-all shadow-xl"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        <div
          ref={rowRef}
          onScroll={onScroll}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
        >
          {loading
            ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
            : items.map((item, i) => (
                <div
                  key={item.id}
                  className="flex-shrink-0"
                  style={{ width: top10 ? undefined : '140px' }}
                >
                  {top10 ? (
                    <div className="flex items-end gap-0">
                      <span className="top10-number select-none" style={{ fontSize: '5.5rem', marginRight: '-12px' }}>
                        {i + 1}
                      </span>
                      <div style={{ width: '120px', flexShrink: 0 }}>
                        <div className="relative overflow-hidden rounded-md bg-[#141414] movie-card" style={{ aspectRatio: '2/3' }}>
                          {item.poster_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                              alt={item.title || item.name}
                              loading="lazy"
                              className="card-img w-full h-full object-cover transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#1a1a1a]" />
                          )}
                          <div className="card-overlay absolute inset-0 bg-black/60 opacity-0 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-semibold text-center px-2 line-clamp-2">{item.title || item.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <MovieCard item={item} />
                  )}
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
