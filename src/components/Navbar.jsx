import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { Film, Search, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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
              <Link
                to="/anime"
                className="px-3 py-2 rounded-md text-sm font-medium hover:text-[--color-cinema-gold] transition-colors"
              >
                Anime
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[--color-cinema-darker] text-white border border-gray-700 rounded-full py-1.5 pl-4 pr-10 focus:outline-none focus:border-[--color-cinema-gold] transition-colors w-64"
              />
              <button
                type="submit"
                className="absolute right-3 top-2 text-gray-400 hover:text-[--color-cinema-gold]"
              >
                <Search className="h-5 w-5" />
              </button>
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[--color-cinema-darker] border border-gray-700 rounded-full py-2 pl-4 pr-10 w-full focus:outline-none focus:border-[--color-cinema-gold]"
              />
              <button
                type="submit"
                className="absolute right-6 top-4 text-gray-400"
              >
                <Search className="h-5 w-5" />
              </button>
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
