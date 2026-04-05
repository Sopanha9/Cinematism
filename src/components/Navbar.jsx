import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { Film, Search, Menu, X, Heart } from "lucide-react";
import { useWatchlist } from "../context/WatchlistContext";
import { searchMulti } from "../services/tmdb";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const searchTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const { watchlist } = useWatchlist();

  useEffect(() => {
    if (!showContactModal) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowContactModal(false);
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [showContactModal]);

  // Handle search suggestions
  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Debounce search suggestions
    setLoadingSuggestions(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const data = await searchMulti(query);
        const suggestionItems = (data.results || [])
          .filter((item) => item?.id && (item.title || item.name))
          .slice(0, 8) // Show top 8 suggestions
          .map((item) => ({
            id: item.id,
            title: item.title || item.name,
            type: item.media_type,
            posterPath: item.poster_path,
          }));
        setSuggestions(suggestionItems);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300); // 300ms debounce
  };

  const handleSuggestionClick = (suggestion) => {
    navigate(`/search?q=${encodeURIComponent(suggestion.title)}`);
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className="fixed w-full z-50 glassmorphism">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <Film className="h-8 w-8 text-[--color-cinema-gold] group-hover:scale-110 transition-transform" />
              <span className="font-bold text-xl tracking-wider text-white text-glow">
                CINE<span className="text-[--color-cinema-gold]">MATISM</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              <Link
                to="/"
                className="px-3 py-2 rounded-md text-sm font-medium hover:text-[--color-cinema-gold] transition-colors"
              >
                Home
              </Link>
              <Link
                to="/movies"
                className="px-3 py-2 rounded-md text-sm font-medium hover:text-[--color-cinema-gold] transition-colors"
              >
                Movies
              </Link>
              <Link
                to="/tv"
                className="px-3 py-2 rounded-md text-sm font-medium hover:text-[--color-cinema-gold] transition-colors"
              >
                TV Shows
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/watchlist"
              className="relative px-3 py-1.5 rounded-full text-sm font-semibold border border-white/20 text-gray-200 hover:border-red-500 hover:text-red-500 transition-colors flex items-center gap-2"
              title="My Watchlist"
            >
              <Heart className="h-4 w-4" />
              <span>Watchlist</span>
              {watchlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {watchlist.length > 99 ? "99+" : watchlist.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setShowContactModal(true)}
              className="px-3 py-1.5 rounded-full text-sm font-semibold border border-white/20 text-gray-200 hover:border-[--color-cinema-gold] hover:text-[--color-cinema-gold] transition-colors"
            >
              Contact Me
            </button>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                onFocus={() =>
                  searchQuery.trim().length >= 2 && setShowSuggestions(true)
                }
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="bg-[--color-cinema-darker] text-white border border-gray-700 rounded-full py-1.5 pl-4 pr-10 focus:outline-none focus:border-[--color-cinema-gold] transition-colors w-64"
              />
              <button
                type="submit"
                className="absolute right-3 top-2 text-gray-400 hover:text-[--color-cinema-gold]"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[--color-cinema-darker]/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-20 max-h-96 overflow-y-auto">
                  {suggestions.map((suggestion) => (
                    <button
                      key={`${suggestion.type}-${suggestion.id}`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/15 transition-all duration-200 border-b border-white/5 last:border-0"
                    >
                      {suggestion.posterPath && (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${suggestion.posterPath}`}
                          alt={suggestion.title}
                          className="w-8 h-12 object-cover rounded flex-shrink-0"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      )}
                      <div className="flex-1 text-left">
                        <p className="text-sm font-semibold text-white truncate">
                          {suggestion.title}
                        </p>
                        <p className="text-xs text-gray-300">
                          {suggestion.type === "tv" ? "TV Show" : "Movie"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Loading State */}
              {showSuggestions && loadingSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[--color-cinema-darker]/95 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center shadow-2xl">
                  <p className="text-sm text-gray-300">Searching...</p>
                </div>
              )}
            </form>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden glassmorphism border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-[--color-cinema-gold]"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/movies"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-[--color-cinema-gold]"
              onClick={() => setIsOpen(false)}
            >
              Movies
            </Link>
            <Link
              to="/tv"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-[--color-cinema-gold]"
              onClick={() => setIsOpen(false)}
            >
              TV Shows
            </Link>
            <Link
              to="/anime"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-[--color-cinema-gold]"
              onClick={() => setIsOpen(false)}
            >
              Anime
            </Link>

            <Link
              to="/watchlist"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-red-500 flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <Heart className="h-4 w-4" />
              <span>
                Watchlist {watchlist.length > 0 && `(${watchlist.length})`}
              </span>
            </Link>

            <button
              onClick={() => {
                setShowContactModal(true);
                setIsOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:text-[--color-cinema-gold]"
            >
              Contact Me
            </button>

            <form onSubmit={handleSearch} className="px-3 py-2 relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                onFocus={() =>
                  searchQuery.trim().length >= 2 && setShowSuggestions(true)
                }
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="bg-[--color-cinema-darker] border border-gray-700 rounded-full py-2 pl-4 pr-10 w-full focus:outline-none focus:border-[--color-cinema-gold]"
              />
              <button
                type="submit"
                className="absolute right-6 top-4 text-gray-400"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Mobile Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-3 right-3 mt-2 bg-[--color-cinema-darker]/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-20 max-h-80 overflow-y-auto">
                  {suggestions.map((suggestion) => (
                    <button
                      key={`${suggestion.type}-${suggestion.id}`}
                      onClick={() => {
                        handleSuggestionClick(suggestion);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-3 hover:bg-white/15 transition-all duration-200 border-b border-white/5 last:border-0"
                    >
                      {suggestion.posterPath && (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${suggestion.posterPath}`}
                          alt={suggestion.title}
                          className="w-6 h-9 object-cover rounded flex-shrink-0"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      )}
                      <div className="flex-1 text-left">
                        <p className="text-xs font-semibold text-white truncate">
                          {suggestion.title}
                        </p>
                        <p className="text-xs text-gray-300">
                          {suggestion.type === "tv" ? "TV Show" : "Movie"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {showContactModal &&
        createPortal(
          <div
            className="contact-modal-overlay fixed inset-0 z-[999] grid place-items-center bg-black/70 p-4"
            onClick={() => setShowContactModal(false)}
          >
            <div
              className="contact-modal-panel w-full max-w-sm rounded-2xl border border-white/25 bg-black/95 p-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Contact Me</h3>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close contact popup"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Scan this QR code if you want to contact me.
              </p>
              <img
                src="/qrcode.png"
                alt="Telegram contact QR"
                className="mt-4 mx-auto h-52 w-52 rounded-xl border border-white/15 bg-white object-contain"
              />
            </div>
          </div>,
          document.body,
        )}
    </nav>
  );
};

export default Navbar;
