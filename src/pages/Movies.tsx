import React, { useEffect, useState } from 'react';
import Carousel from '../components/Carousel';
import MovieCard from '../components/MovieCard';
import { getPopular, getTopRated, getNowPlaying, getUpcoming, getTrending, TMDBItem } from '../services/tmdb';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Movies() {
  const [trending, setTrending] = useState<TMDBItem[]>([]);
  const [top10, setTop10] = useState<TMDBItem[]>([]);
  const [nowPlaying, setNowPlaying] = useState<TMDBItem[]>([]);
  const [upcoming, setUpcoming] = useState<TMDBItem[]>([]);
  const [topRated, setTopRated] = useState<TMDBItem[]>([]);
  const [allMovies, setAllMovies] = useState<TMDBItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [t, top, np, up, tr] = await Promise.all([
          getTrending('movie', 'day'),
          getTrending('movie', 'week'),
          getNowPlaying(),
          getUpcoming(),
          getTopRated('movie'),
        ]);
        setTrending(t.slice(0, 20));
        setTop10(top.slice(0, 10));
        setNowPlaying(np.slice(0, 20));
        setUpcoming(up.slice(0, 20));
        setTopRated(tr.slice(0, 20));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadPage = async () => {
      setPageLoading(true);
      try {
        const res = await getPopular('movie', page);
        setAllMovies(res.results);
        setTotalPages(Math.min(res.total_pages, 500));
      } finally {
        setPageLoading(false);
      }
    };
    loadPage();
  }, [page]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-20">
        <h1 className="font-display text-4xl sm:text-5xl text-white mb-6 pt-4">Movies</h1>

        <Carousel title="Trending Today" items={trending} loading={loading} />
        <Carousel title="Top 10 This Week" items={top10} loading={loading} top10 />
        <Carousel title="Now Playing" items={nowPlaying} loading={loading} />
        <Carousel title="Coming Soon" items={upcoming} loading={loading} />
        <Carousel title="Top Rated" items={topRated} loading={loading} />

        {/* All movies grid */}
        <div className="py-6">
          <h2 className="section-title font-display text-2xl sm:text-3xl text-white mb-6 tracking-wide">Popular Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {pageLoading
              ? Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="skeleton rounded-md" style={{ aspectRatio: '2/3' }} />
                ))
              : allMovies.map((item) => <MovieCard key={item.id} item={item} />)}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-full bg-white/10 hover:bg-[#e50914] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <span className="text-gray-300 text-sm font-medium">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-full bg-white/10 hover:bg-[#e50914] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
