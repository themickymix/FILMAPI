import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Trending from "./pages/Trending";
import Movie from "./pages/Movie";
import TV from "./pages/TV";
import ResultInfo from "./pages/ResultInfo";
import SearchResult from "./pages/SearchResult";
import Footer from "./components/Footer";
function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}>
      <Navbar />
      <div className="mt-5 mx-4 md:px-[15%] ">
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Trending />} />

          {/* Trending Page Route */}
          <Route path="/trending" element={<Trending />} />

          {/* Movie Detail Page Route */}
          <Route path="/movie/" element={<Movie />} />
          <Route path="/tv/" element={<TV />} />
          <Route path="/result/:type/:id" element={<ResultInfo />} />
          <Route path="/results/" element={<SearchResult/>} />
        </Routes>
    <Footer/>
      </div>
    </Router>
  );
}

export default App;
