import React, { useEffect, useState } from "react";
import { movieapi, tvapi, topmovie, toptv } from "../constant"; // Import API functions
import Card from "../components/Card";
import Latest from "./Latest";
import { Link } from "react-router-dom"; // Import Link for navigation
import Carousel from "../components/Carousel";
function Trending() {
  // State for movie and TV data
  const [movies, setMovies] = useState([]);
  const [topmovies, setTopMovies] = useState([]);
  const [tv, setTv] = useState([]);
  const [toptvs, setTopTvs] = useState([]);

  // State for loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State to control active sections
  const [activeTrendingSection, setActiveTrendingSection] = useState("movie");
  const [activeTopRatedSection, setActiveTopRatedSection] = useState("movie");

  // Fetch all data on mount
  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([movieapi(), topmovie(), tvapi(), toptv()])
      .then(([movieData, topMovieData, tvData, topTvData]) => {
        setMovies(movieData);
        setTopMovies(topMovieData);
        setTv(tvData);
        setTopTvs(topTvData);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Render a grid of cards
  const renderCards = (items, limit = 8, type = "movie") =>
    items.slice(0, limit).map((item) => {
      const date = (item.release_date || item.first_air_date || "").split(
        "-"
      )[0];
      const linkUrl =
        type === "movie" ? `/result/movie/${item.id}` : `/result/tv/${item.id}`;

      return (
        <Link to={linkUrl} key={item.id}>
          <Card
            date={`${date} •`}
            name={item.title || item.name} // Support movies and TV shows
            img={`https://image.tmdb.org/t/p/w500/${
              item.poster_path || "default.jpg"
            }`}
          />
        </Link>
      );
    });

  if (loading) {
    return (
      <p className="text-center text-xl text-purple-700">
        <span className="loading loading-dots loading-lg"></span>
      </p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <>
      <div>
        <Carousel />
        <div className="mb-2 mt-10">
          <div className="flex gap-6">
            <span className="text-purple-700 font-bold text-xl">Trending</span>
            <div className="flex gap-3 w-40">
              <button
                className={`rounded-sm px-3 font-light text-white ${
                  activeTrendingSection === "movie"
                    ? "bg-purple-700 shadow-md shadow-black"
                    : ""
                }`}
                onClick={() => setActiveTrendingSection("movie")}>
                Movie
              </button>
              <button
                className={`rounded-sm px-3 font-light text-white ${
                  activeTrendingSection === "tv"
                    ? "bg-purple-700 shadow-md shadow-black"
                    : ""
                }`}
                onClick={() => setActiveTrendingSection("tv")}>
                TV Show
              </button>
            </div>
          </div>

          {/* Render Trending Movies or TV Shows */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {activeTrendingSection === "movie"
              ? renderCards(movies)
              : renderCards(tv, 8, "tv")}
          </div>
        </div>

        {/* Top Rated Section */}
        <div className="mb-10 mt-10">
          <div className="flex gap-6">
            <span className="text-purple-700 font-bold text-xl">Top Rated</span>
            <div className="flex gap-3">
              <button
                className={`rounded-sm px-3 font-light text-white ${
                  activeTopRatedSection === "movie"
                    ? "bg-purple-700 shadow-md shadow-black"
                    : ""
                }`}
                onClick={() => setActiveTopRatedSection("movie")}>
                Movie
              </button>
              <button
                className={`rounded-sm px-3 font-light text-white ${
                  activeTopRatedSection === "tv"
                    ? "bg-purple-700 shadow-md shadow-black"
                    : ""
                }`}
                onClick={() => setActiveTopRatedSection("tv")}>
                TV Show
              </button>
            </div>
          </div>

          {/* Render Top Rated Movies or TV Shows */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {activeTopRatedSection === "movie"
              ? renderCards(topmovies, 6)
              : renderCards(toptvs, 6, "tv")}
          </div>
        </div>
      </div>
      <Latest />
    </>
  );
}

export default Trending;
