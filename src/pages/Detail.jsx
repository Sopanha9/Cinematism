import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Clock, Calendar, Play, Heart } from "lucide-react";
import { getMovieDetails } from "../services/tmdb";
import {
  getVidKingMovieEmbedUrl,
  getVidKingTvEmbedUrl,
} from "../services/vidking";
import { useWatchlist } from "../context/WatchlistContext";
import LoadingSpinner from "../components/LoadingSpinner";
import VideoPlayer from "../components/VideoPlayer";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE = "https://image.tmdb.org/t/p/original";

const Detail = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isWatching, setIsWatching] = useState(false);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [maxEpisodes, setMaxEpisodes] = useState(1);
  const [activeSource, setActiveSource] = useState("vidking");
  const [reloadNonce, setReloadNonce] = useState(0);

  useEffect(() => {
    setIsWatching(false);
    setSeason(1);
    setEpisode(1);
    setMaxEpisodes(1);
    setActiveSource("vidking");
    setReloadNonce(0);
  }, [id, type]);

  useEffect(() => {
    if (!details) {
      return;
    }

    setActiveSource("vidking");
    setReloadNonce(0);
  }, [details, type]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const validTypes = ["movie", "tv"];
        const actualType = validTypes.includes(type) ? type : "movie";

        const data = await getMovieDetails(id, actualType);
        setDetails(data);
      } catch (err) {
        console.error("Error fetching details:", err);
        setError("Failed to load details. The item might not exist.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id, type]);

  useEffect(() => {
    if (type !== "tv" || !details?.seasons) {
      return;
    }

    const validSeasons = details.seasons.filter(
      (s) => (s?.episode_count || 0) > 0,
    );

    if (validSeasons.length === 0) {
      setMaxEpisodes(1);
      setEpisode(1);
      return;
    }

    const selectedSeason = validSeasons.find((s) => s.season_number === season);
    const fallbackSeason =
      validSeasons.find((s) => s.season_number > 0) || validSeasons[0];
    const effectiveSeason = selectedSeason || fallbackSeason;
    const episodesInSeason = effectiveSeason.episode_count || 1;

    if (!selectedSeason && effectiveSeason.season_number !== season) {
      setSeason(effectiveSeason.season_number);
    }

    setMaxEpisodes(episodesInSeason);

    if (!selectedSeason || episode > episodesInSeason) {
      setEpisode(1);
    }
  }, [season, details, type, episode]);

  if (loading)
    return (
      <div className="pt-20">
        <LoadingSpinner />
      </div>
    );
  if (error || !details)
    return (
      <div className="pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-red-400 mb-4">{error || "Not found"}</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-cinema-gold hover:underline flex items-center mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </button>
        </div>
      </div>
    );

  const title = details.title || details.name;
  const releaseDate = details.release_date || details.first_air_date;
  const runtime =
    details.runtime ||
    (details.episode_run_time && details.episode_run_time[0]) ||
    null;
  const backdropUrl = details.backdrop_path
    ? `${TMDB_BACKDROP_BASE}${details.backdrop_path}`
    : "";
  const posterUrl = details.poster_path
    ? `${TMDB_IMAGE_BASE}${details.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";
  const trailer = details.videos?.results?.find(
    (vid) => vid.site === "YouTube" && vid.type === "Trailer",
  );
  const trailerUrl = trailer?.key
    ? `https://www.youtube.com/watch?v=${trailer.key}`
    : "";

  const vidSrcTvUrl =
    type === "tv"
      ? `https://vidsrcme.ru/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`
      : "";

  const vidSrcMovieUrl = `https://vidsrcme.ru/embed/movie?tmdb=${id}`;

  const streamSources =
    type === "tv"
      ? [
          {
            id: "vidking",
            label: "VidKing",
            getUrl: () =>
              getVidKingTvEmbedUrl(id, season, episode, {
                color: "f5c518",
                nextEpisode: true,
                episodeSelector: true,
              }),
          },
          {
            id: "vidsrc",
            label: "VidSrc",
            getUrl: () => vidSrcTvUrl,
          },
          {
            id: "youtube",
            label: "Trailer (Video.js)",
            getUrl: () => trailerUrl,
            disabled: !trailerUrl,
          },
        ]
      : [
          {
            id: "vidking",
            label: "VidKing",
            getUrl: () =>
              getVidKingMovieEmbedUrl(id, {
                color: "f5c518",
              }),
          },
          {
            id: "vidsrc",
            label: "VidSrc",
            getUrl: () => vidSrcMovieUrl,
          },
          {
            id: "youtube",
            label: "Trailer (Video.js)",
            getUrl: () => trailerUrl,
            disabled: !trailerUrl,
          },
        ];
  const selectedSource =
    streamSources.find(
      (source) => source.id === activeSource && !source.disabled,
    ) || streamSources[0];
  const streamUrl = selectedSource.getUrl();
  const availableSeasons =
    type === "tv"
      ? (details.seasons || []).filter((s) => (s?.episode_count || 0) > 0)
      : [];
  const episodeOptions =
    type === "tv"
      ? Array.from({ length: maxEpisodes }, (_, index) => index + 1)
      : [];

  const switchToNextSource = () => {
    const currentIndex = streamSources.findIndex(
      (source) => source.id === activeSource,
    );
    const nextIndex =
      currentIndex >= 0 ? (currentIndex + 1) % streamSources.length : 0;
    setActiveSource(streamSources[nextIndex].id);
    setReloadNonce((prev) => prev + 1);
  };

  const goToPreviousEpisode = () => {
    setEpisode((prev) => Math.max(1, prev - 1));
  };

  const goToNextEpisode = () => {
    setEpisode((prev) => Math.min(maxEpisodes, prev + 1));
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Backdrop */}
      <div className="relative w-full h-[50vh] md:h-[60vh]">
        <div className="absolute inset-0">
          <img
            src={backdropUrl || posterUrl}
            alt={title}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[--color-cinema-darker] via-[--color-cinema-darker]/80 to-transparent"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 md:-mt-64 relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-300 hover:text-cinema-gold transition-colors bg-black/50 px-4 py-2 rounded-full w-max backdrop-blur-sm"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
            <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10 aspect-[2/3]">
              <img
                src={posterUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="w-full md:w-2/3 lg:w-3/4 pt-4 md:pt-16 lg:pt-32">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-glow">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-300 mb-6 font-medium">
              <div className="flex items-center text-cinema-gold">
                <Star className="w-5 h-5 fill-current mr-1" />
                <span className="text-lg">
                  {details.vote_average?.toFixed(1)}
                </span>
              </div>

              {releaseDate && (
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 opacity-70" />
                  <span>{new Date(releaseDate).getFullYear()}</span>
                </div>
              )}

              {runtime && (
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 opacity-70" />
                  <span>{runtime} min</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {details.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <h3 className="text-2xl font-bold mb-3 text-white border-b border-gray-800 pb-2">
              Overview
            </h3>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              {details.overview || "No overview available."}
            </p>

            {/* Watch Player */}
            <div className="mb-10">
              {!isWatching ? (
                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => setIsWatching(true)}
                    className="flex items-center gap-2 bg-cinema-gold text-black px-8 py-4 rounded-full font-bold text-lg hover:brightness-110 transition-all shadow-[0_0_20px_rgba(255,193,7,0.3)] hover:shadow-[0_0_30px_rgba(255,193,7,0.5)] active:scale-95"
                  >
                    <Play className="w-6 h-6 fill-current" />
                    Watch Now
                  </button>
                  <button
                    onClick={() =>
                      toggleWatchlist({
                        id: parseInt(id),
                        title: title,
                        posterPath: details.poster_path,
                        type: type,
                        releaseDate: releaseDate,
                        rating: details.vote_average,
                      })
                    }
                    className="flex items-center gap-2 bg-black/50 hover:bg-black/75 text-white px-6 py-4 rounded-full font-semibold transition-all border border-white/20 hover:border-red-500"
                    title={
                      isInWatchlist(parseInt(id), type)
                        ? "Remove from watchlist"
                        : "Add to watchlist"
                    }
                  >
                    <Heart
                      className={`w-6 h-6 transition-colors ${
                        isInWatchlist(parseInt(id), type)
                          ? "fill-red-500 text-red-500"
                          : "text-white"
                      }`}
                    />
                    <span className="hidden sm:inline">
                      {isInWatchlist(parseInt(id), type) ? "Saved" : "Save"}
                    </span>
                  </button>
                </div>
              ) : (
                <div className="w-full max-w-4xl animate-fade-in">
                  {type === "tv" && (
                    <div className="flex flex-wrap items-center gap-6 mb-4 bg-white/10 p-4 rounded-xl border border-white/20 shadow-lg backdrop-blur-sm">
                      <div className="flex items-center gap-3 relative">
                        <label className="text-gray-200 font-semibold text-sm uppercase tracking-wider">
                          Season
                        </label>
                        <div className="flex items-center bg-black/60 border border-white/20 rounded-lg overflow-hidden focus-within:border-cinema-gold focus-within:ring-1 focus-within:ring-cinema-gold transition-all">
                          <select
                            value={season}
                            onChange={(e) =>
                              setSeason(parseInt(e.target.value, 10) || 1)
                            }
                            className="bg-transparent px-3 py-2 text-white font-medium outline-none"
                            disabled={availableSeasons.length === 0}
                          >
                            {availableSeasons.map((seasonItem) => (
                              <option
                                key={seasonItem.id || seasonItem.season_number}
                                value={seasonItem.season_number}
                                className="bg-[--color-cinema-darker]"
                              >
                                Season {seasonItem.season_number}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-gray-200 font-semibold text-sm uppercase tracking-wider">
                          Episode
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={goToPreviousEpisode}
                            disabled={episode <= 1}
                            className="px-2.5 py-2 rounded-lg border border-white/20 bg-black/50 text-sm text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:border-cinema-gold hover:text-cinema-gold transition-colors"
                          >
                            Prev
                          </button>
                          <div className="flex items-center bg-black/60 border border-white/20 rounded-lg overflow-hidden focus-within:border-cinema-gold focus-within:ring-1 focus-within:ring-cinema-gold transition-all">
                            <select
                              value={episode}
                              onChange={(e) =>
                                setEpisode(parseInt(e.target.value, 10) || 1)
                              }
                              className="bg-transparent px-3 py-2 text-white font-medium outline-none"
                              disabled={episodeOptions.length === 0}
                            >
                              {episodeOptions.map((episodeNumber) => (
                                <option
                                  key={episodeNumber}
                                  value={episodeNumber}
                                  className="bg-[--color-cinema-darker]"
                                >
                                  Episode {episodeNumber}
                                </option>
                              ))}
                            </select>
                            <span className="text-gray-400 text-sm pr-3 font-medium border-l border-white/10 pl-2">
                              of {maxEpisodes}
                            </span>
                          </div>
                          <button
                            onClick={goToNextEpisode}
                            disabled={episode >= maxEpisodes}
                            className="px-2.5 py-2 rounded-lg border border-white/20 bg-black/50 text-sm text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:border-cinema-gold hover:text-cinema-gold transition-colors"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    {streamSources.map((source) => (
                      <button
                        key={source.id}
                        onClick={() => setActiveSource(source.id)}
                        disabled={source.disabled}
                        className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                          activeSource === source.id
                            ? "bg-cinema-gold text-black border-cinema-gold"
                            : "bg-black/40 text-gray-200 border-white/20 hover:border-cinema-gold hover:text-cinema-gold"
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                      >
                        {source.label}
                      </button>
                    ))}

                    <button
                      onClick={() => setReloadNonce((prev) => prev + 1)}
                      className="px-3 py-1.5 rounded-full text-sm font-semibold border border-white/20 bg-black/40 text-gray-200 hover:border-cinema-gold hover:text-cinema-gold transition-colors"
                    >
                      Reload Player
                    </button>

                    <a
                      href={streamUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-full text-sm font-semibold border border-white/20 bg-black/40 text-gray-200 hover:border-cinema-gold hover:text-cinema-gold transition-colors"
                    >
                      Open in New Tab
                    </a>
                  </div>

                  <div className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl border border-gray-800 bg-black relative">
                    {activeSource === "youtube" && streamUrl ? (
                      <div
                        key={`${streamUrl}-${reloadNonce}`}
                        className="absolute top-0 left-0 w-full h-full"
                      >
                        <VideoPlayer src={streamUrl} />
                      </div>
                    ) : (
                      <iframe
                        key={`${streamUrl}-${reloadNonce}`}
                        src={streamUrl}
                        title="Streaming player"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                        referrerPolicy="origin-when-cross-origin"
                        allowFullScreen
                        className="absolute top-0 left-0 w-full h-full"
                      ></iframe>
                    )}
                  </div>
                  <div className="mt-3 p-3 rounded-lg border border-white/10 bg-black/30">
                    <p className="text-sm text-gray-300">
                      If playback fails or shows unavailable, try these quick
                      actions.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {streamSources.length > 1 && (
                        <button
                          onClick={switchToNextSource}
                          className="px-3 py-1.5 rounded-full text-sm font-semibold border border-white/20 bg-black/40 text-gray-200 hover:border-cinema-gold hover:text-cinema-gold transition-colors"
                        >
                          Try Other Source
                        </button>
                      )}
                      <button
                        onClick={() => setReloadNonce((prev) => prev + 1)}
                        className="px-3 py-1.5 rounded-full text-sm font-semibold border border-white/20 bg-black/40 text-gray-200 hover:border-cinema-gold hover:text-cinema-gold transition-colors"
                      >
                        Reload Current Source
                      </button>
                      {type === "tv" && (
                        <button
                          onClick={goToNextEpisode}
                          disabled={episode >= maxEpisodes}
                          className="px-3 py-1.5 rounded-full text-sm font-semibold border border-white/20 bg-black/40 text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:border-cinema-gold hover:text-cinema-gold transition-colors"
                        >
                          Try Next Episode
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {trailer && (
              <div>
                <h3 className="text-2xl font-bold mb-4 text-white">Trailer</h3>
                <div className="aspect-video w-full max-w-3xl rounded-xl overflow-hidden shadow-lg border border-gray-800">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title="Trailer"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {/* Cast (Optional nice-to-have) */}
            {details.credits?.cast?.length > 0 && (
              <div className="mt-10">
                <h3 className="text-2xl font-bold mb-4 text-white">Top Cast</h3>
                <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                  {details.credits.cast.slice(0, 10).map((actor) => (
                    <div
                      key={actor.id}
                      className="flex-shrink-0 w-24 md:w-32 text-center"
                    >
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-2 border-2 border-transparent hover:border-cinema-gold transition-colors cursor-pointer bg-cinema-gray">
                        <img
                          src={
                            actor.profile_path
                              ? `${TMDB_IMAGE_BASE}${actor.profile_path}`
                              : "https://via.placeholder.com/150?text=No+Image"
                          }
                          alt={actor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm font-medium text-white truncate">
                        {actor.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {actor.character}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
