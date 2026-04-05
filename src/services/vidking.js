const DEFAULT_VIDKING_BASE_URL = "https://www.vidking.net";

const VIDKING_BASE_URL = (
  import.meta.env.VITE_VIDKING_BASE_URL || DEFAULT_VIDKING_BASE_URL
).replace(/\/$/, "");

const normalizeBoolean = (value) => (value ? "true" : "false");

const buildQuery = (params) => {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    search.set(key, String(value));
  });

  const query = search.toString();
  return query ? `?${query}` : "";
};

export const getVidKingMovieEmbedUrl = (tmdbId, options = {}) => {
  const { color = "f5c518", autoPlay = false, progress } = options;
  const query = buildQuery({
    color,
    autoPlay: normalizeBoolean(autoPlay),
    progress,
  });

  return `${VIDKING_BASE_URL}/embed/movie/${tmdbId}${query}`;
};

export const getVidKingTvEmbedUrl = (tmdbId, season, episode, options = {}) => {
  const {
    color = "f5c518",
    autoPlay = false,
    nextEpisode = true,
    episodeSelector = true,
    progress,
  } = options;

  const query = buildQuery({
    color,
    autoPlay: normalizeBoolean(autoPlay),
    nextEpisode: normalizeBoolean(nextEpisode),
    episodeSelector: normalizeBoolean(episodeSelector),
    progress,
  });

  return `${VIDKING_BASE_URL}/embed/tv/${tmdbId}/${season}/${episode}${query}`;
};
