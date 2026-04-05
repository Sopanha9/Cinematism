import React from "react";
import { Routes, Route } from "react-router-dom";
import { WatchlistProvider } from "./context/WatchlistContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import Watchlist from "./pages/Watchlist";

function App() {
  return (
    <WatchlistProvider>
      <div className="bg-[--color-cinema-darker] min-h-screen text-white font-sans selection:bg-[--color-cinema-gold] selection:text-black">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home mode="home" />} />
            <Route path="/movies" element={<Home mode="movies" />} />
            <Route path="/tv" element={<Home mode="tv" />} />
            <Route path="/anime" element={<Home mode="anime" />} />
            <Route path="/search" element={<Search />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/detail/:type/:id" element={<Detail />} />
          </Routes>
        </main>

        <footer className="w-full py-8 text-center text-gray-500 border-t border-gray-800 mt-auto">
          <p>
            &copy; {new Date().getFullYear()} Cinema JS. This product uses the
            TMDB API but is not endorsed or certified by TMDB.
          </p>
          <p className="mt-2 text-sm text-gray-400 px-4">
            Note: We use free APIs and free streaming sources, so some movies or
            anime may be unavailable or fail to play. Sorry for this issue -
            most titles should still work normally.
          </p>
        </footer>
      </div>
    </WatchlistProvider>
  );
}

export default App;
