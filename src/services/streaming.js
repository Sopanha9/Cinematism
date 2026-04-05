import axios from "axios";

const DEFAULT_CONSUMET_API = "https://api.consumet.org";
const CONSUMET_API = (
  import.meta.env.VITE_CONSUMET_API_URL || DEFAULT_CONSUMET_API
).replace(/\/$/, "");

const consumetApi = axios.create({
  baseURL: CONSUMET_API,
  timeout: 10000,
});

// Search anime on Consumet to get streaming links
export const searchAnimeStreaming = async (query) => {
  try {
    const response = await consumetApi.get(
      `/anime/hianime/${encodeURIComponent(query)}`,
    );
    return response.data?.results || [];
  } catch (error) {
    console.error("Error searching anime on Consumet:", error);
    throw error;
  }
};

// Get anime info including episodes by Consumet provider id.
export const getAnimeEpisodes = async (providerId) => {
  try {
    const response = await consumetApi.get(`/anime/hianime/info/${providerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching anime episodes:", error);
    throw error;
  }
};

// Get stream sources for a specific episode id.
export const getEpisodeStream = async (episodeId) => {
  try {
    const response = await consumetApi.get(`/anime/hianime/watch/${episodeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching episode stream:", error);
    throw error;
  }
};

export default consumetApi;
