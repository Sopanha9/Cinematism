import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Heart, Film } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { searchMulti, TMDB_W92, TMDBItem } from '../services/tmdb';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<TMDBItem[]>([]);
  const [showSugg, setShowSugg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { watchlist } = useWatchlist();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (query.trim().length < 2) { setSuggestions([]); setShowSugg(false); return; }
    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const data = await searchMulti(query);
        setSuggestions((data.results || []).slice(0, 8));
        setShowSugg(true);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    }, 280);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSugg(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const doSearch = (q: string) => {
    if (!q.trim()) return;
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
    setQuery(''); setShowSugg(false); setSearchOpen(false); setMenuOpen(false);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/movies', label: 'Movies' },
    { href: '/tv', label: 'TV Shows' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-nav' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <Film className="w-6 h-6 text-[#e50914]" />
          <span className="font-display text-2xl tracking-widest text-white">
            CINE<span className="text-[#e50914]">MATISM</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              to={href}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-md hover:bg-white/5"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div ref={searchRef} className="relative">
            {searchOpen ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && doSearch(query)}
                  placeholder="Search movies, shows..."
                  className="w-56 md:w-72 bg-white/10 border border-white/20 rounded-full py-1.5 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#e50914] transition-colors"
                />
                <button onClick={() => { setSearchOpen(false); setQuery(''); setShowSugg(false); }} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
                {/* Suggestions */}
                {showSugg && suggestions.length > 0 && (
                  <div className="absolute top-full right-0 mt-2 w-72 bg-[#141414] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto scrollbar-hide">
                    {suggestions.map((s) => (
                      <button
                        key={`${s.media_type}-${s.id}`}
                        onMouseDown={() => {
                          navigate(`/detail/${s.media_type || s.type}/${s.id}`);
                          setQuery(''); setShowSugg(false); setSearchOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/8 transition-colors border-b border-white/5 last:border-0 text-left"
                      >
                        {s.poster_path ? (
                          <img src={`${TMDB_W92}${s.poster_path}`} alt="" className="w-8 h-11 object-cover rounded flex-shrink-0" />
                        ) : (
                          <div className="w-8 h-11 bg-white/10 rounded flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">{s.title || s.name}</p>
                          <p className="text-xs text-gray-400">{s.media_type === 'tv' ? 'TV Show' : 'Movie'}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {loading && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-[#141414] border border-white/10 rounded-xl p-3 text-center text-sm text-gray-400 z-50">
                    Searching...
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="p-2 text-gray-300 hover:text-white transition-colors">
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Watchlist */}
          <Link to="/watchlist" className="relative p-2 text-gray-300 hover:text-white transition-colors">
            <Heart className="w-5 h-5" />
            {watchlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#e50914] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {watchlist.length > 9 ? '9+' : watchlist.length}
              </span>
            )}
          </Link>

          {/* Mobile menu */}
          <button className="md:hidden p-2 text-gray-300 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden glass-nav border-t border-white/5 px-4 py-3 space-y-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              to={href}
              className="block px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/watchlist"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md"
            onClick={() => setMenuOpen(false)}
          >
            <Heart className="w-4 h-4" />
            Watchlist {watchlist.length > 0 && `(${watchlist.length})`}
          </Link>
        </div>
      )}
    </nav>
  );
}
