import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get URL params
import { options } from "../constant"; // Assuming API options are stored here

function ResultInfo() {
  const { type, id } = useParams(); // Access the type (movie, tv, person) and id from the URL
  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]); // To store the cast details (for movies/TV)
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="md:grid grid-cols-2 md:px-5 gap-5 text-white">
      <div>
        <img
          className="rounded-xl shadow-2xl md:w-96 place-self-end"
          src={
            details.poster_path || details.profile_path
              ? `https://image.tmdb.org/t/p/w500/${
                  details.poster_path || details.profile_path
                }`
              : "https://placehold.co/400x600?text=No+Image+Available"
          }
          alt={details.title || details.name || details.original_name}
        />
      </div>

      <div>
        <h1 className="text-lg shadow-lg font-bold mt-5 md:mt-0">
          {details.title || details.name || details.original_name}
        </h1>
        <p className="font-extralight text-sm">
          {details.overview || details.biography}
        </p>

        {/* Display movie/TV specific info */}
        {type === "movie" && (
          <div className="mt-5">
            <span className="font-bold flex gap-2">
              Release Date:
              <p className="font-light">{details.release_date}</p>
            </span>
          </div>
        )}
        {type === "tv" && (
          <div className="mt-5">
            <span className="font-bold flex gap-2">
              First Air Date:
              <p className="font-light">{details.first_air_date}</p>
            </span>
          </div>
        )}

        {/* Display person-specific info */}
        {type === "person" && (
          <div className="mt-5">
            <h3 className="font-bold mt-3">Known For:</h3>
            {/* Check if known_for exists and is an array */}
            {details.known_for && details.known_for.length > 0 ? (
              <ul>
                {details.known_for.map((movie) => (
                  <li key={movie.id}>{movie.title || movie.name}</li>
                ))}
              </ul>
            ) : (
              <p>No known movies or TV shows available.</p>
            )}
          </div>
        )}

        {/* Genre Section for movies/TV */}
        {type !== "person" && (
          <div className="flex gap-2 font-bold">
            Genre:{" "}
            <p className="font-light">
              {details?.genres?.length > 0 ? (
                details.genres.map((genre, index) => (
                  <span key={genre.id} className="genre-name">
                    {genre.name}
                    {index < details.genres.length - 1 && ", "}
                  </span>
                ))
              ) : (
                <span>No genres available</span>
              )}
            </p>
          </div>
        )}

        {/* Cast List Section for movie/TV */}
        {type !== "person" && (
          <div>
            <h2 className="font-bold mb-2">Top Cast:</h2>
            <div className="grid grid-cols-2 gap-2">
              {cast.length > 0 ? (
                cast.slice(0, 6).map((actor) => (
                  <div key={actor.id} className="flex gap-2">
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
                ))
              ) : (
                <p>No cast information available</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultInfo;
