import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const getPopular = async (type = "movie", page = 1) => {
  const response = await tmdbApi.get(`/${type}/popular`, {
    params: { page },
  });
  return response.data;
};

export const getTrending = async (type = "movie", timeWindow = "week") => {
  const response = await tmdbApi.get(`/trending/${type}/${timeWindow}`, {
    params: {},
  });
  return response.data;
};

export const searchMovies = async (query, page = 1) => {
  const response = await tmdbApi.get(`/search/movie`, {
    params: { query, page },
  });
  return response.data;
};

export const searchMulti = async (query, page = 1) => {
  const response = await tmdbApi.get(`/search/multi`, {
    params: { query, page },
  });
  // Filter to only movies and TV shows (remove people)
  const results = (response.data.results || []).filter(
    (item) => item.media_type === "movie" || item.media_type === "tv",
  );
  return {
    ...response.data,
    results,
  };
};

export const getMovieDetails = async (id, type = "movie") => {
  const response = await tmdbApi.get(`/${type}/${id}`, {
    params: { append_to_response: "videos,credits" },
  });
  return response.data;
};

export const getTVShows = async (page = 1) => {
  const response = await tmdbApi.get(`/tv/popular`, {
    params: { page },
  });
  return response.data;
};

export const getSimilar = async (id, type = "movie") => {
  const response = await tmdbApi.get(`/${type}/${id}/similar`, {
    params: { page: 1 },
  });
  return response.data;
};

export default tmdbApi;
