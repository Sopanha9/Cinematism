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

export const searchMovies = async (query, page = 1) => {
  const response = await tmdbApi.get(`/search/movie`, {
    params: { query, page },
  });
  return response.data;
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

export const getAnimeShows = async (page = 1) => {
  const response = await tmdbApi.get("/discover/tv", {
    params: {
      page,
      with_genres: "16",
      with_original_language: "ja",
      sort_by: "popularity.desc",
    },
  });
  return response.data;
};

export default tmdbApi;
