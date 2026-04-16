import React from 'react';
import { Film } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 mt-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-[#e50914]" />
          <span className="font-display text-xl tracking-widest text-white">
            CINE<span className="text-[#e50914]">MATISM</span>
          </span>
        </div>
        <div className="text-center text-xs text-gray-600 max-w-md">
          <p>&copy; {new Date().getFullYear()} Cinematism. This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
          <p className="mt-1">We use free streaming sources. Some titles may be unavailable.</p>
        </div>
        <div className="flex items-center gap-1">
          <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" alt="TMDB" className="h-4 opacity-40" />
        </div>
      </div>
    </footer>
  );
}
