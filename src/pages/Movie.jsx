import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { options } from "../constant";
import { Link } from "react-router-dom";

function Movie() {
  const [movie, setMovie] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage]); // Re-fetch movies when page changes

  const discovermovie = (page) => {
    return fetch(
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`,
      options
    )
      .then((res) => res.json())
      .then((res) => {
        setMovie(res.results); // Set movies for the current page
        setTotalPages(res.total_pages); // Set total pages
      })
      .catch((err) => {
        console.error("Error fetching trending movies:", err);
      })
      .finally(() => {
        setLoading(false); // Stop loading
      });
  };

  const fetchMovies = (page) => {
    setLoading(true); // Start loading when new page is selected
    discovermovie(page);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return; // Prevent invalid page numbers
    setCurrentPage(pageNumber); // Change page
  };

  return (
    <div className="flex flex-col text-white">
    <span className="text-purple-500 font-semibold text-xl">Latest Movies</span>
      {/* Pagination controls */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          className="btn btn-outline text-white"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}>
          Prev
        </button>
        <span className="text-lg place-content-center">
          {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-outline text-white"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}>
          Next
        </button>
      </div>

      {/* Movie Cards Section */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4 place-content-center justify-items-center content-center">
        {loading ? (
          <div className="flex justify-center items-center flex-col">
            <span className="loading loading-bars loading-lg"></span>
          </div> // Loading spinner
        ) : (
          movie.map((item) => {
            const date = (item.release_date || item.first_air_date || "").split(
              "-"
            )[0];
            return (
                <Link to={`/result/movie/${item.id}`} key={item.id}>
              <Card
                date={date}
                name={item.title || item.name || "Untitled"}
                img={`https://image.tmdb.org/t/p/w500/${
                  item.poster_path || "default.jpg"
                }`}
              />
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Movie;
