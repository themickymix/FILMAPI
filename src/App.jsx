import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Lazy load the components
const Navbar = lazy(() => import("./components/Navbar"));
const Trending = lazy(() => import("./pages/Trending"));
const Movie = lazy(() => import("./pages/Movie"));
const TV = lazy(() => import("./pages/TV"));
const ResultInfo = lazy(() => import("./pages/ResultInfo"));
const SearchResult = lazy(() => import("./pages/SearchResult"));
const Footer = lazy(() => import("./components/Footer"));

function App() {
  return (
    <div className="bg-[#1D232A]">
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}>
        {/* Wrap the Navbar with Suspense to provide a fallback */}
        <Suspense fallback={<div>Loading...</div>}>
          <Navbar />
        </Suspense>

        <div className="mt-5 mx-4 lg:px-[15%]">
          <Suspense fallback={<div>Loading pages...</div>}>
            <Routes>
              {/* Default Route */}
              <Route path="/" element={<Trending />} />

              {/* Trending Page Route */}
              <Route path="/trending" element={<Trending />} />

              {/* Movie Detail Page Route */}
              <Route path="/movie/" element={<Movie />} />
              <Route path="/tv/" element={<TV />} />
              <Route path="/result/:type/:id" element={<ResultInfo />} />
              <Route path="/results/" element={<SearchResult />} />
            </Routes>
          </Suspense>

          {/* Wrap the Footer with Suspense to provide a fallback */}
          <Suspense fallback={<div>Loading footer...</div>}>
            <Footer />
          </Suspense>
        </div>
      </Router>
    </div>
  );
}

export default App;
  