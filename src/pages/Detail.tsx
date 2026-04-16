import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Calendar, Play, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  getMovieDetails, getSimilar, TMDBDetails, TMDB_IMG, TMDB_BACKDROP,
  getVidKingMovieUrl, getVidKingTvUrl, getVidSrcMovieUrl, getVidSrcTvUrl
} from '../services/tmdb';
import { useWatchlist } from '../context/WatchlistContext';
import Carousel from '../components/Carousel';

export default function Detail() {
  const params = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const { type = 'movie', id = '' } = params;
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const [details, setDetails] = useState<TMDBDetails | null>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isWatching, setIsWatching] = useState(false);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [maxEpisodes, setMaxEpisodes] = useState(1);
  const [activeSource, setActiveSource] = useState('vidking');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setIsWatching(false);
    setSeason(1);
    setEpisode(1);
    setActiveSource('vidking');
    setReloadKey(0);
    setLoading(true);
    setError('');
    setDetails(null);

    const load = async () => {
      try {
        const [det, sim] = await Promise.all([
          getMovieDetails(id, type),
          getSimilar(id, type),
        ]);
        setDetails(det);
        setSimilar(sim.slice(0, 20));
      } catch {
        setError('Failed to load. The title might not exist.');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id, type]);

  useEffect(() => {
    if (type !== 'tv' || !details?.seasons) return;
    const valid = details.seasons.filter((s) => (s.episode_count || 0) > 0);
    if (!valid.length) { setMaxEpisodes(1); setEpisode(1); return; }
    const sel = valid.find((s) => s.season_number === season) || valid.find((s) => s.season_number > 0) || valid[0];
    if (sel.season_number !== season) setSeason(sel.season_number);
    setMaxEpisodes(sel.episode_count || 1);
    if (episode > (sel.episode_count || 1)) setEpisode(1);
  }, [season, details, type]);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 flex items-center justify-center">
      <div className="flex gap-2">
        {[0,1,2].map(i => (
          <div key={i} className="w-2 h-2 bg-[#e50914] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );

  if (error || !details) return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-400 text-lg mb-4">{error || 'Not found'}</p>
        <button onClick={() => window.history.back()} className="text-[#e50914] hover:underline">← Go Back</button>
      </div>
    </div>
  );

  const title = details.title || details.name || '';
  const releaseDate = details.release_date || details.first_air_date || '';
  const year = releaseDate.substring(0, 4);
  const runtime = details.runtime || details.episode_run_time?.[0];
  const backdropUrl = details.backdrop_path ? `${TMDB_BACKDROP}${details.backdrop_path}` : '';
  const posterUrl = details.poster_path ? `${TMDB_IMG}${details.poster_path}` : '';
  const trailer = details.videos?.results?.find((v) => v.site === 'YouTube' && v.type === 'Trailer');
  const inWL = isInWatchlist(parseInt(id), type);

  const sources = type === 'tv'
    ? [
        { id: 'vidking', label: 'Server 1', getUrl: () => getVidKingTvUrl(id, season, episode) },
        { id: 'vidsrc', label: 'Server 2', getUrl: () => getVidSrcTvUrl(id, season, episode) },
        ...(trailer ? [{ id: 'trailer', label: 'Trailer', getUrl: () => `https://www.youtube.com/embed/${trailer.key}` }] : []),
      ]
    : [
        { id: 'vidking', label: 'Server 1', getUrl: () => getVidKingMovieUrl(id) },
        { id: 'vidsrc', label: 'Server 2', getUrl: () => getVidSrcMovieUrl(id) },
        ...(trailer ? [{ id: 'trailer', label: 'Trailer', getUrl: () => `https://www.youtube.com/embed/${trailer.key}` }] : []),
      ];

  const currentSource = sources.find((s) => s.id === activeSource) || sources[0];
  const streamUrl = currentSource.getUrl();
  const validSeasons = (details.seasons || []).filter((s) => (s.episode_count || 0) > 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Backdrop */}
      <div className="relative w-full h-[55vh] md:h-[65vh] overflow-hidden">
        {backdropUrl && (
          <img src={backdropUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 -mt-40 md:-mt-56 relative z-10 pb-20">
        {/* Back */}
        <button
          onClick={() => window.history.back()}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 w-48 md:w-56 lg:w-64">
            <div className="rounded-lg overflow-hidden shadow-2xl border border-white/10" style={{ aspectRatio: '2/3' }}>
              {posterUrl ? (
                <img src={posterUrl} alt={title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                  <span className="text-gray-600 text-sm">No Image</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-2 md:pt-10 lg:pt-20">
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-3">
              {details.genres?.map((g) => (
                <span key={g.id} className="text-xs text-gray-300 bg-white/10 border border-white/10 px-2.5 py-1 rounded-full">
                  {g.name}
                </span>
              ))}
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white leading-none mb-4">{title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-5">
              {details.vote_average && details.vote_average > 0 && (
                <span className="flex items-center gap-1 text-[#f5c518] font-bold text-base">
                  <Star className="w-4 h-4 fill-current" />
                  {details.vote_average.toFixed(1)}
                </span>
              )}
              {year && <span className="flex items-center gap-1"><Calendar className="w-4 h-4 opacity-60" />{year}</span>}
              {runtime && <span className="flex items-center gap-1"><Clock className="w-4 h-4 opacity-60" />{runtime} min</span>}
              {details.number_of_seasons && (
                <span className="flex items-center gap-1">{details.number_of_seasons} Season{details.number_of_seasons > 1 ? 's' : ''}</span>
              )}
            </div>

            {details.tagline && (
              <p className="text-[#e50914] text-sm italic mb-3 font-medium">"{details.tagline}"</p>
            )}

            <p className="text-gray-300 text-base leading-relaxed mb-8 max-w-2xl">{details.overview}</p>

            {/* Action buttons */}
            {!isWatching ? (
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <button
                  onClick={() => setIsWatching(true)}
                  className="flex items-center gap-2 bg-[#e50914] hover:bg-[#c40812] text-white font-bold px-8 py-3 rounded-md transition-colors"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Watch Now
                </button>
                <button
                  onClick={() => toggleWatchlist({ ...details, type, id: parseInt(id) })}
                  className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold border transition-colors ${
                    inWL
                      ? 'bg-[#e50914]/10 border-[#e50914] text-[#e50914]'
                      : 'bg-white/10 border-white/20 text-white hover:border-[#e50914] hover:text-[#e50914]'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${inWL ? 'fill-[#e50914]' : ''}`} />
                  {inWL ? 'Saved' : 'Watchlist'}
                </button>
                {trailer && (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-6 py-3 rounded-md font-semibold border border-white/20 bg-white/5 text-white hover:border-white/40 transition-colors text-sm"
                  >
                    Trailer
                  </a>
                )}
              </div>
            ) : (
              <div className="w-full max-w-4xl mb-8">
                {/* TV controls */}
                {type === 'tv' && (
                  <div className="flex flex-wrap items-center gap-4 mb-3 bg-white/5 border border-white/10 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Season</label>
                      <select
                        value={season}
                        onChange={(e) => setSeason(parseInt(e.target.value))}
                        className="bg-[#1a1a1a] border border-white/20 text-white text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-[#e50914]"
                      >
                        {validSeasons.map((s) => (
                          <option key={s.id} value={s.season_number} className="bg-[#1a1a1a]">Season {s.season_number}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Episode</label>
                      <button onClick={() => setEpisode((p) => Math.max(1, p - 1))} disabled={episode <= 1} className="p-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-30">
                        <ChevronLeft className="w-4 h-4 text-white" />
                      </button>
                      <select
                        value={episode}
                        onChange={(e) => setEpisode(parseInt(e.target.value))}
                        className="bg-[#1a1a1a] border border-white/20 text-white text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-[#e50914]"
                      >
                        {Array.from({ length: maxEpisodes }, (_, i) => i + 1).map((ep) => (
                          <option key={ep} value={ep} className="bg-[#1a1a1a]">Episode {ep}</option>
                        ))}
                      </select>
                      <button onClick={() => setEpisode((p) => Math.min(maxEpisodes, p + 1))} disabled={episode >= maxEpisodes} className="p-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-30">
                        <ChevronRight className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Source tabs */}
                <div className="flex items-center gap-2 mb-3">
                  {sources.map((src) => (
                    <button
                      key={src.id}
                      onClick={() => { setActiveSource(src.id); setReloadKey((k) => k + 1); }}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                        activeSource === src.id
                          ? 'bg-[#e50914] border-[#e50914] text-white'
                          : 'bg-white/5 border-white/20 text-gray-300 hover:border-[#e50914] hover:text-white'
                      }`}
                    >
                      {src.label}
                    </button>
                  ))}
                  <button
                    onClick={() => setReloadKey((k) => k + 1)}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold border border-white/20 bg-white/5 text-gray-300 hover:text-white transition-colors"
                  >
                    Reload
                  </button>
                </div>

                {/* Player */}
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10 shadow-2xl">
                  <iframe
                    key={`${streamUrl}-${reloadKey}`}
                    src={streamUrl}
                    title="Player"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  If playback fails, try another server or reload.
                </p>
              </div>
            )}

            {/* Cast */}
            {details.credits?.cast && details.credits.cast.length > 0 && (
              <div className="mb-8">
                <h3 className="font-display text-2xl text-white mb-4">Top Cast</h3>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                  {details.credits.cast.slice(0, 12).map((actor) => (
                    <div key={actor.id} className="flex-shrink-0 w-20 text-center">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-[#1a1a1a] border-2 border-white/10 hover:border-[#e50914] transition-colors mb-2">
                        <img
                          src={actor.profile_path ? `${TMDB_IMG}${actor.profile_path}` : ''}
                          alt={actor.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                      <p className="text-white text-xs font-medium truncate">{actor.name}</p>
                      <p className="text-gray-500 text-[10px] truncate">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mt-8">
            <Carousel title={`More Like This`} items={similar} />
          </div>
        )}
      </div>
    </div>
  );
}
