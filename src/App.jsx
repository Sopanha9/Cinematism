import React from "react";
import { Routes, Route } from "react-router-dom";
import { WatchlistProvider } from "./context/WatchlistContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import TV from "./pages/TV";
import Search from "./pages/Search";
import Watchlist from "./pages/Watchlist";
import Detail from "./pages/Detail";

function App() {
  return (
    <WatchlistProvider>
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv" element={<TV />} />
            <Route path="/search" element={<Search />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/detail/:type/:id" element={<Detail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </WatchlistProvider>
  );
}

export default App;
