import React, { useEffect, useState } from "react";
import { discovermovie, discovertv } from "../constant";
import Card from "../components/Card";
import { Link } from "react-router-dom"; // Import Link for navigation

function Latest() {
  const [movielatest, setMovieLatest] = useState([]);
  const [tvlatest, setTvLatest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({ movie: null, tv: null });

  useEffect(() => {
    setLoading(true);

    // Fetch latest movies
    discovermovie()
      .then((data) => {
        if (data && data.length > 0) {
          setMovieLatest(data);
        } else {
          setError((prev) => ({
            ...prev,
            movie: "No movies available at the moment.",
          }));
        }
      })
      .catch((err) => {
        console.error("Error fetching latest movies:", err);
        setError((prev) => ({
          ...prev,
          movie: "Failed to load latest movies. Please try again later.",
        }));
      });

    // Fetch latest TV shows
    discovertv()
      .then((data) => {
        if (data && data.length > 0) {
          setTvLatest(data);
        } else {
          setError((prev) => ({
            ...prev,
            tv: "No TV shows available at the moment.",
          }));
        }
      })
      .catch((err) => {
        console.error("Error fetching latest TV shows:", err);
        setError((prev) => ({
          ...prev,
          tv: "Failed to load latest TV shows. Please try again later.",
        }));
      })
      .finally(() => setLoading(false));
  }, []);

  // Show loading spinner
  if (loading) {
    return (
      <div className="text-center text-lg font-semibold">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  // Show errors
  if (error.movie && error.tv) {
    return (
      <div className="text-center text-red-500 text-lg font-semibold">
        {error.movie}
        <br />
        {error.tv}
      </div>
    );
  }

  return (
    <div>
      {/* Latest Movies Section */}
      <Section
        title="Latest Movies"
        data={movielatest}
        error={error.movie}
        viewAllLink="/movie" 
        type="movie"
      />

      {/* Latest TV Shows Section */}
      <Section
        title="Latest TV Shows"
        data={tvlatest}
        error={error.tv}
        viewAllLink="/tv" 
        type="tv" 
      />
    </div>
  );
}

// Section Component for modularity
function Section({ title, data, error, viewAllLink, type }) {
  return (
    <div className="mt-4 text-white">
      <div className="flex gap-6">
        <span className="text-purple-700 font-bold text-xl whitespace-nowrap">
          {title}
        </span>
        <div className="flex justify-end w-full items-baseline gap-3 hover:text-purple-500 cursor-pointer">
          {/* Use Link directly with the correct viewAllLink */}
          <Link to={viewAllLink} className="flex gap-2 items-center">
            View All
            <img className="h-3 invert" src="/arrow-right.svg" alt="arrow" />
          </Link>
        </div>
      </div>

      {/* Error or Cards */}
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {data.slice(0, 6).map((item) => {
            const date = (item.release_date || item.first_air_date || "").split(
              "-"
            )[0];
            const linkUrl =
              type === "movie"
                ? `/result/movie/${item.id}`
                : `/result/tv/${item.id}`;
            return (
              <Link to={linkUrl} key={item.id}>
                <Card
                  date={`${date} •`}
                  name={item.title || item.name || "Untitled"}
                  img={`https://image.tmdb.org/t/p/w500/${
                    item.poster_path || "default.jpg"
                  }`}
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}


export default Latest;
