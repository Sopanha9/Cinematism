import React, { useEffect, useState } from 'react';
import HeroBanner from '../components/HeroBanner';
import Carousel from '../components/Carousel';
import { getTrending, getPopular, getTopRated, getNowPlaying, getAiringToday, TMDBItem } from '../services/tmdb';

export default function Home() {
  const [hero, setHero] = useState<TMDBItem[]>([]);
  const [trending, setTrending] = useState<TMDBItem[]>([]);
  const [top10Movies, setTop10Movies] = useState<TMDBItem[]>([]);
  const [top10TV, setTop10TV] = useState<TMDBItem[]>([]);
  const [popular, setPopular] = useState<TMDBItem[]>([]);
  const [nowPlaying, setNowPlaying] = useState<TMDBItem[]>([]);
  const [popularTV, setPopularTV] = useState<TMDBItem[]>([]);
  const [airingToday, setAiringToday] = useState<TMDBItem[]>([]);
  const [topRated, setTopRated] = useState<TMDBItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [trendAll, trendMov, trendTV, popMov, popTV, np, air, tr] = await Promise.all([
          getTrending('all', 'day'),
          getTrending('movie', 'week'),
          getTrending('tv', 'week'),
          getPopular('movie'),
          getPopular('tv'),
          getNowPlaying(),
          getAiringToday(),
          getTopRated('movie'),
        ]);
        setHero(trendAll.slice(0, 5));
        setTrending(trendAll.slice(0, 20));
        setTop10Movies(trendMov.slice(0, 10));
        setTop10TV(trendTV.slice(0, 10));
        setPopular(popMov.results.slice(0, 20));
        setNowPlaying(np.slice(0, 20));
        setPopularTV(popTV.results.slice(0, 20));
        setAiringToday(air.slice(0, 20));
        setTopRated(tr.slice(0, 20));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <HeroBanner items={hero} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 -mt-20 relative z-10 pb-20">
        <Carousel title="Trending Today" items={trending} loading={loading} />
        <Carousel title="Top 10 Movies This Week" items={top10Movies} loading={loading} top10 />
        <Carousel title="Now Playing" items={nowPlaying} loading={loading} />
        <Carousel title="Top 10 TV Shows This Week" items={top10TV} loading={loading} top10 />
        <Carousel title="Popular TV Shows" items={popularTV} loading={loading} />
        <Carousel title="Airing Today" items={airingToday} loading={loading} />
        <Carousel title="Top Rated Movies" items={topRated} loading={loading} />
        <Carousel title="Popular Movies" items={popular} loading={loading} />
      </div>
    </div>
  );
}
