import React, { useEffect, useState } from "react";
import { discovermovie, discovertv, poppeople } from "../constant";
import Card from "../components/Card";
import Card2 from "../components/Card2";
import { Link } from "react-router-dom"; // Import Link for navigation

function Latest() {
  const [movielatest, setMovieLatest] = useState([]);
  const [tvlatest, setTvLatest] = useState([]);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({ movie: null, tv: null });

  useEffect(() => {
    setLoading(true);
    const fetchMovies = discovermovie()
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

    const fetchTVShows = discovertv()
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
      });

    const fetchPeople = poppeople()
      .then((data) => {
        if (data && data.length > 0) {
          setPeople(data);
        } else {
          setError((prev) => ({
            ...prev,
            people: "No popular personalities available at the moment.",
          }));
        }
      })
      .catch((err) => {
        console.error("Error fetching popular personalities:", err);
        setError((prev) => ({
          ...prev,
          people:
            "Failed to load popular personalities. Please try again later.",
        }));
      });

    Promise.all([fetchMovies, fetchTVShows, fetchPeople]).finally(() =>
      setLoading(false)
    );
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
      <Section
        title="Popular Personalities"
        data={people}
        error={error.people}
        type="people"
      />
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

function Section({ title, data, error, viewAllLink, type }) {
  const scrollRef = React.useRef(null); // Reference for the scrollable container

  // Function to scroll left
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -300, // Adjust scroll distance as needed
        behavior: "smooth",
      });
    }
  };

  // Function to scroll right
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 300, // Adjust scroll distance as needed
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="mt-4 text-white relative">
      {/* Title and View All */}
      <div className="flex gap-6">
        <span className="text-purple-700 font-bold text-xl whitespace-nowrap">
          {title}
        </span>
        {/* Conditionally render View All link for non-people sections */}
        {type !== "people" && (
          <div className="flex justify-end w-full items-baseline gap-3 hover:text-purple-500 cursor-pointer">
            <Link to={viewAllLink} className="flex gap-2 items-center">
              View All
              <img className="h-3 invert" src="/arrow-right.svg" alt="arrow" />
            </Link>
          </div>
        )}
      </div>

      {/* Error or Cards */}
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : type === "people" ? (
        <div className="relative">
          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-5 items-center overflow-x-auto whitespace-nowrap scrollbar-hide mt-3"
            style={{ scrollbarWidth: "none" }}>
            {data.map((item) => (
              <Link to={`/result/person/${item.id}`} key={item.id}>
                <Card2
                  key={item.id}
                  img={`https://image.tmdb.org/t/p/w500/${
                    item.profile_path || "default.jpg"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Previous Button */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full text-5xl">
            &#8249; {/* Unicode for a left arrow */}
          </button>

          {/* Next Button */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full text-5xl">
            &#8250; {/* Unicode for a right arrow */}
          </button>
        </div>
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
                  category={item.media_type}
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
