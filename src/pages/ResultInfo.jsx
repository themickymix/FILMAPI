import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom"; // Import useParams to get URL params
import { options } from "../constant"; // Assuming API options are stored here
import Card3 from "../components/Card2";
function ResultInfo() {
  const { type, id } = useParams(); // Access the type (movie, tv, person) and id from the URL
  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]); // To store the cast details (for movies/TV)
  const [knownFor, setKnownFor] = useState([]); // To store known for movies/TV shows for a person
  const [loading, setLoading] = useState(false);

  const movieRef = useRef(null); // Ref for the movie section
  const tvRef = useRef(null); // Ref for the TV section

  const scrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollLeft += 200; // Scroll by 200px on click
    }
  };

  const scrollLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollLeft -= 200; // Scroll by 200px on click
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetails(type, id); // Fetch details based on type and id
    }
  }, [type, id]);

  const fetchDetails = (type, id) => {
    setLoading(true);
    let url = "";

    // Construct the URL based on the type
    if (type === "movie") {
      url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
    } else if (type === "tv") {
      url = `https://api.themoviedb.org/3/tv/${id}?language=en-US`;
    } else if (type === "person") {
      url = `https://api.themoviedb.org/3/person/${id}?language=en-US`; // For person details
    }

    // Fetch main details
    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        setDetails(data);
        if (type !== "person") {
          fetchCast(type, id); // Fetch cast details for movie/TV
        } else {
          fetchKnownFor(id); // Fetch known for movies/TV shows for person
        }
      })
      .catch((err) => console.error("Error fetching details:", err))
      .finally(() => setLoading(false));
  };

  // Fetch cast information for movies/TV
  const fetchCast = (type, id) => {
    let castUrl = "";
    if (type === "movie") {
      castUrl = `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`;
    } else if (type === "tv") {
      castUrl = `https://api.themoviedb.org/3/tv/${id}/credits?language=en-US`;
    }

    fetch(castUrl, options)
      .then((res) => res.json())
      .then((data) => {
        setCast(data.cast); // Store cast data
      })
      .catch((err) => console.error("Error fetching cast:", err));
  };

  // Fetch known movies or TV shows for a person
  const fetchKnownFor = (id) => {
    const url = `https://api.themoviedb.org/3/person/${id}/combined_credits?language=en-US`;
    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        setKnownFor(data.cast); // Store known movies/TV shows data
      })
      .catch((err) =>
        console.error("Error fetching known movies/TV shows:", err)
      );
  };

  if (loading) {
    return (
      <div>
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  if (!details) {
    return (
      <div>
        No details found for {type} with ID: {id}
      </div>
    );
  }

  // Destructure fields from details for cleaner code
  const {
    title,
    name,
    original_name,
    poster_path,
    profile_path,
    overview,
    biography,
    release_date,
    first_air_date,
    genres,
  } = details;

  return (
    <div className="md:grid grid-cols-2 md:px-5 gap-5 text-white">
      <div>
        <img
          className="rounded-xl shadow-2xl md:w-96 place-self-end"
          src={
            poster_path || profile_path
              ? `https://image.tmdb.org/t/p/w500/${poster_path || profile_path}`
              : "https://placehold.co/400x600?text=No+Image+Available"
          }
          alt={title || name || original_name}
        />
      </div>

      <div>
        <h1 className="text-lg shadow-lg font-bold mt-5 md:mt-0">
          {title || name || original_name}
        </h1>
        <p className="font-extralight text-sm">{overview || biography}</p>

        {/* Display movie/TV specific info */}
        {type === "movie" && (
          <div className="mt-5">
            <span className="font-bold flex gap-2">
              Release Date:
              <p className="font-light">{release_date}</p>
            </span>
          </div>
        )}
        {type === "tv" && (
          <div className="mt-5">
            <span className="font-bold flex gap-2">
              First Air Date:
              <p className="font-light">{first_air_date}</p>
            </span>
          </div>
        )}

        {/* Display person-specific info */}
        {type === "person" && (
          <div className="mt-5">
            <h3 className="font-bold mt-3">Known For:</h3>

            {/* Movie Section */}
            {knownFor.filter((item) => item.media_type === "movie").length >
              0 && (
              <div className="relative">
                <div
                  className="flex gap-5 items-center overflow-x-auto whitespace-nowrap scrollbar-hide mt-3"
                  style={{ scrollbarWidth: "none" }}
                  ref={movieRef}>
                  {knownFor
                    .filter((item) => item.media_type === "movie")
                    .map((movie, index) => (
                      <Link
                        to={`/result/movie/${movie.id}`}
                        key={`knownFor-movie-${movie.id}-${index}`}>
                        <Card3
                          img={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                        />
                      </Link>
                    ))}
                </div>
                {/* Scroll buttons */}
                <button
                  onClick={() => scrollLeft(movieRef)}
                  className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full">
                  &#8249;
                </button>
                <button
                  onClick={() => scrollRight(movieRef)}
                  className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full">
                  &#8250;
                </button>
              </div>
            )}

            {/* TV Section */}
            {knownFor.filter((item) => item.media_type === "tv").length > 0 && (
              <div className="relative mt-5">
                <div
                  className="flex gap-5 items-center overflow-x-auto whitespace-nowrap scrollbar-hide mt-3"
                  style={{ scrollbarWidth: "none" }}
                  ref={tvRef}>
                  {knownFor
                    .filter((item) => item.media_type === "tv")
                    .map((tv, index) => (
                      <Link
                        to={`/result/tv/${tv.id}`}
                        key={`knownFor-tv-${tv.id}-${index}`}>
                        <Card3
                          img={`https://image.tmdb.org/t/p/w500/${tv.poster_path}`}
                        />
                      </Link>
                    ))}
                </div>
                {/* Scroll buttons */}
                <button
                  onClick={() => scrollLeft(tvRef)}
                  className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full">
                  &#8249;
                </button>
                <button
                  onClick={() => scrollRight(tvRef)}
                  className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full">
                  &#8250;
                </button>
              </div>
            )}

            {/* If there are no known movies or TV shows */}
            {knownFor.filter((item) => item.media_type === "movie").length ===
              0 &&
              knownFor.filter((item) => item.media_type === "tv").length ===
                0 && <p>No known movies or TV shows available.</p>}
          </div>
        )}

        {/* Genre Section for movies/TV */}
        {type !== "person" && genres?.length > 0 && (
          <div className="flex gap-2 font-bold">
            Genre:{" "}
            <p className="font-light">
              {genres.map((genre, index) => (
                <span key={genre.id} className="genre-name">
                  {genre.name}
                  {index < genres.length - 1 && ", "}
                </span>
              ))}
            </p>
          </div>
        )}

        {/* Cast List Section for movie/TV */}
        {type !== "person" && cast.length > 0 && (
          <div>
            <h2 className="font-bold mb-2">Top Cast:</h2>
            <div className="grid grid-cols-2 gap-2">
              {cast.slice(0, 6).map((actor) => (
                <div key={`cast-${actor.id}`} className="flex gap-2">
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w500/${actor.profile_path}`
                        : "https://placehold.co/100x150?text=No+Image"
                    }
                    alt={actor.name}
                    className="rounded-md w-14 items-end"
                  />
                  <div className="flex flex-col justify-center">
                    <p className="text-xs">{actor.name}</p>
                    <p className="text-xs">as {actor.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultInfo;
