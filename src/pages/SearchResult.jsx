import React, { useEffect, useState } from "react";
import Card4 from "../components/Card4";
import { options } from "../constant";
import { Link, useLocation } from "react-router-dom";

function SearchResult() {
  const [movie, setMovie] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(""); // Store the search query

  const location = useLocation();

  // Get the query parameter from the URL
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return params.get("query");
  };

  // Fetch the movie and people results when the page or query changes
  useEffect(() => {
    const query = getQueryParams();
    if (query) {
      setQuery(query);
      fetchResults(query, currentPage); // Fetch results based on query and page number
    }
  }, [location.search, currentPage]); // Re-fetch when search params or currentPage changes

  // Function to fetch movie and person results
  const fetchResults = async (query, page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
          query
        )}&page=${page}&api_key=${options.api_key}`,
        { ...options, method: "GET" }
      );
      const data = await response.json();
      setMovie(data.results); // Store movie and person results
      setTotalPages(data.total_pages); // Update total pages for pagination
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change for pagination
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return; // Prevent invalid page numbers
    setCurrentPage(pageNumber); // Change page
  };

  return (
    <div className="flex  flex-col">
      <span className="font-semibold text-purple-500">
        Search results for "{query}"
      </span>

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

      {/* Movie & Person Cards Section */}
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
            const isPerson = item.media_type === "person";
            const isTv = item.media_type === "tv";

            return (
              <Link to={`/result/${item.media_type}/${item.id}`} key={item.id}>
                <Card4
                  name={
                    item.title || item.name || item.original_name || "Untitled"
                  }
                  img={
                    isPerson
                      ? item.profile_path
                        ? `https://image.tmdb.org/t/p/w500/${item.profile_path}`
                        : "https://placehold.co/400x600?text=No+Image+Available"
                      : item.poster_path
                      ? `https://image.tmdb.org/t/p/w500/${item.poster_path}`
                      : "https://placehold.co/400x600?text=No+Image+Available"
                  }
                  date={date}
                  category={
                    isTv ? "• TV Show" : isPerson ? "Artist" : "• Movie"
                  }
                />
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

export default SearchResult;
