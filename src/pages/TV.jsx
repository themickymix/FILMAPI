import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { options } from "../constant";
import { Link } from "react-router-dom";
function TV() {
  const [tv, setTV] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTV(currentPage);
  }, [currentPage]); // Re-fetch tv shows when page changes

  const discovertv = (page) => {
    return fetch(
      `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=popularity.desc`,
      options
    )
      .then((res) => res.json())
      .then((res) => {
        setTV(res.results); // Set tv shows for the current page
        setTotalPages(res.total_pages); // Set total pages
      })
      .catch((err) => {
        console.error("Error fetching trending tv shows:", err);
      })
      .finally(() => {
        setLoading(false); // Stop loading
      });
  };

  const fetchTV = (page) => {
    setLoading(true); // Start loading when new page is selected
    discovertv(page);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return; // Prevent invalid page numbers
    setCurrentPage(pageNumber); // Change page
  };

  return (
    <div className="flex flex-col text-white">
      <span className="text-purple-500 font-semibold text-xl">
        Latest TV Shows
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

      {/* TV Shows Cards Section */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4 justify-items-center">
        {loading ? (
          <div className="flex justify-center items-center">
            <span className="loading loading-bars loading-lg"></span>
          </div>
        ) : (
          tv.map((item) => {
            const date = (item.release_date || item.first_air_date || "").split(
              "-"
            )[0];
            return (
              <Link to={`/result/tv/${item.id}`} key={item.id}>
                <Card
                  key={item.id}
                  date={date + " •"}
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

export default TV;
