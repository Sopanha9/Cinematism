import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMulti, getSimilar, TMDBItem } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import Carousel from '../components/Carousel';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = new URLSearchParams(qs).get('q') || '';
  const [results, setResults] = useState<TMDBItem[]>([]);
  const [similar, setSimilar] = useState<TMDBItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query) { setResults([]); setSimilar([]); return; }
    const load = async () => {
      setLoading(true);
      setError('');
      setSimilar([]);
      try {
        const data = await searchMulti(query);
        const res = (data.results || []).filter((i: TMDBItem) => i.id && (i.title || i.name));
        setResults(res);
        if (res.length > 0) {
          const sim = await getSimilar(res[0].id, res[0].type || res[0].media_type || 'movie');
          setSimilar(sim.slice(0, 20));
        }
      } catch {
        setError('Search failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [query]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {!query ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Search className="w-16 h-16 text-gray-700 mb-4" />
            <h2 className="font-display text-3xl text-white mb-2">Search Movies & Shows</h2>
            <p className="text-gray-500">Use the search bar above to find your favorite titles.</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400">{error}</p>
          </div>
        ) : loading ? (
          <div>
            <h2 className="section-title font-display text-3xl text-white mb-6">Results for "{query}"</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="skeleton rounded-md" style={{ aspectRatio: '2/3' }} />
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <h2 className="font-display text-3xl text-white mb-2">No Results Found</h2>
            <p className="text-gray-500">Nothing matched "{query}". Try a different keyword.</p>
          </div>
        ) : (
          <>
            <h2 className="section-title font-display text-3xl text-white mb-6">Results for "{query}"</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-12">
              {results.map((item) => <MovieCard key={item.id} item={item} />)}
            </div>
            {similar.length > 0 && (
              <Carousel title={`More Like "${results[0]?.title || results[0]?.name}"`} items={similar} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
