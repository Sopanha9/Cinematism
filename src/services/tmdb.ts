import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY },
});

export const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';
export const TMDB_BACKDROP = 'https://image.tmdb.org/t/p/original';
export const TMDB_W92 = 'https://image.tmdb.org/t/p/w92';

export interface TMDBItem {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  overview?: string;
  media_type?: string;
  genre_ids?: number[];
  type?: string;
}

export interface TMDBDetails extends TMDBItem {
  genres?: { id: number; name: string }[];
  runtime?: number;
  episode_run_time?: number[];
  videos?: { results: { key: string; site: string; type: string }[] };
  credits?: { cast: { id: number; name: string; character: string; profile_path?: string }[] };
  seasons?: { id: number; season_number: number; episode_count: number; name: string }[];
  tagline?: string;
  status?: string;
  number_of_seasons?: number;
}

const ensureType = (items: TMDBItem[], defaultType = 'movie'): TMDBItem[] =>
  (items || []).map((item) => ({
    ...item,
    type: item.type || item.media_type || (item.title ? 'movie' : item.name ? 'tv' : defaultType),
  }));

export const getTrending = async (type: string = 'all', window: string = 'day') => {
  const res = await tmdbApi.get(`/trending/${type}/${window}`);
  return ensureType(res.data.results || []);
};

export const getPopular = async (type: string = 'movie', page: number = 1) => {
  const res = await tmdbApi.get(`/${type}/popular`, { params: { page } });
  return { results: ensureType(res.data.results || [], type), total_pages: res.data.total_pages };
};

export const getTopRated = async (type: string = 'movie') => {
  const res = await tmdbApi.get(`/${type}/top_rated`);
  return ensureType(res.data.results || [], type);
};

export const getNowPlaying = async () => {
  const res = await tmdbApi.get('/movie/now_playing');
  return ensureType(res.data.results || [], 'movie');
};

export const getUpcoming = async () => {
  const res = await tmdbApi.get('/movie/upcoming');
  return ensureType(res.data.results || [], 'movie');
};

export const getAiringToday = async () => {
  const res = await tmdbApi.get('/tv/airing_today');
  return ensureType(res.data.results || [], 'tv');
};

export const getMovieDetails = async (id: string | number, type: string = 'movie'): Promise<TMDBDetails> => {
  const res = await tmdbApi.get(`/${type}/${id}`, {
    params: { append_to_response: 'videos,credits' },
  });
  return res.data;
};

export const searchMulti = async (query: string, page: number = 1) => {
  const res = await tmdbApi.get('/search/multi', { params: { query, page } });
  const results = (res.data.results || []).filter(
    (item: TMDBItem) => item.media_type === 'movie' || item.media_type === 'tv'
  );
  return { ...res.data, results: ensureType(results) };
};

export const getSimilar = async (id: string | number, type: string = 'movie') => {
  const res = await tmdbApi.get(`/${type}/${id}/similar`);
  return ensureType(res.data.results || [], type);
};

export const getVidKingMovieUrl = (id: string | number) =>
  `https://vidsrc.to/embed/movie/${id}`;

export const getVidKingTvUrl = (id: string | number, season: number, episode: number) =>
  `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`;

export const getVidSrcMovieUrl = (id: string | number) =>
  `https://www.vidking.net/embed/movie/${id}?color=e50914`;

export const getVidSrcTvUrl = (id: string | number, season: number, episode: number) =>
  `https://www.vidking.net/embed/tv/${id}/${season}/${episode}?color=e50914&nextEpisode=true&episodeSelector=true`;
