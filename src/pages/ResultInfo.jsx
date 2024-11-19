import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom"; // Import useParams to get URL params
import { options } from "../constant"; // Assuming API options are stored here
import Card3 from "../components/Card2";

function ResultInfo() {
  const { type, id } = useParams(); // Access the type (movie, tv, person) and id from the URL
  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]); // To store the cast details (for movies/TV)
  const [knownFor, setKnownFor] = useState([]); // To store known for movies/TV shows for a person
  const [seasons, setSeasons] = useState([]); // To store the seasons of a TV show
  const [episodes, setEpisodes] = useState([]); // To store episodes of a selected season
  const [selectedSeason, setSelectedSeason] = useState(null); // Track the selected season
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

  useEffect(() => {
    if (seasons.length > 0) {
      fetchEpisodes(seasons[0].season_number); // Automatically fetch episodes for the first season when seasons are available
    }
  }, [seasons]); // Only run this effect when seasons are updated

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
        if (type === "tv" && data.seasons) {
          setSeasons(data.seasons); // Store TV seasons
        }
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

  const fetchEpisodes = (seasonNumber) => {
    if (!id || !seasonNumber) return;

    const url = `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?language=en-US`;
    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        setEpisodes(data.episodes || [0]);
        setSelectedSeason(seasonNumber);
      })
      .catch((err) => console.error("Error fetching episodes:", err));
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
              ? `https://image.tmdb.org/t/p/original/${
                  poster_path || profile_path
                }`
              : "https://placehold.co/400x600?text=No+Image+Available"
          }
          alt={title || name || original_name}
        />
      </div>

      <div>
        <h1 className="text-lg font-bold mt-5 md:mt-0">
          {title || name || original_name}
        </h1>
        <p className="font-extralight text-sm">{overview || biography}</p>
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
        {type === "movie" && (
          <span className="font-bold flex gap-2">
            Release Date:
            <p className="font-light">{release_date}</p>
          </span>
        )}
        {type === "tv" && (
          <div>
            <span className="font-bold flex gap-2">
              First Air Date:
              <p className="font-light">{first_air_date}</p>
            </span>
            <div className="  shadow-2xl p-2 rounded-xl mb-3">
              {/* TV Seasons Dropdown */}
              {seasons.length > 0 && (
                <div className="mt-4">
                  <select
                    className="select select-bordered bg-[#1D232A] w-full"
                    onChange={(e) => fetchEpisodes(e.target.value)}
                    value={selectedSeason || seasons[0]?.season_number || ""}>
                    {seasons.map((season) => (
                      <option key={season.id} value={season.season_number}>
                        {season.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Episodes List */}
              {episodes.length > 0 && (
                <ul
                  className="max-h-32 overflow-auto mt-3 p-2 rounded-md"
                  style={{ scrollbarWidth: "none" }}>
                  {episodes.map((episode) => {
                    const currentDate = new Date();
                    const episodeAirDate = new Date(episode.air_date);

                    return (
                      <li
                        key={episode.id}
                        className="p-2 flex place-items-center gap-3">
                        <img
                          className="w-24 rounded-md"
                          src={
                            // Check if the episode's air date is in the future
                            episodeAirDate > currentDate
                              ? "https://placehold.co/600x400?text=Coming+Soon"
                              : episode.still_path
                              ? `https://image.tmdb.org/t/p/w500/${episode.still_path}`
                              : "https://placehold.co/600x400?text=No+Image+Available"
                          }
                          alt={
                            episodeAirDate > currentDate
                              ? "Coming Soon"
                              : "Episode still"
                          }
                        />

                        <div className="flex flex-col ">
                          <span className="font-bold">
                            {episode.episode_number}. {episode.name}
                          </span>
                          <span className="flex justify-items-center items-center gap-1 text-sm">
                            <span className="text-sm">
                              {new Date(episode.air_date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </span>
                            <span>
                              {episode.runtime ? `• ${episode.runtime}m` : null}
                            </span>
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Cast Section */}
        {type !== "person" && cast.length > 0 && (
          <div>
            <h2 className="font-bold mb-2">Top Cast:</h2>
            <div className="grid grid-cols-2 gap-2">
              {cast.slice(0, 6).map((actor) => (
                <Link to={`/result/person/${actor.id}`}>
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
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Display person-specific info */}
        {type === "person" && (
          <div className="mt-5">
            <h3 className="font-bold mt-3">Known For:</h3>

            {/* Movie Section */}
            {knownFor.filter((item) => item.media_type === "movie").length >
              0 && (
              <div>
                <span className="text-purple-700 font-semibold">Movies</span>
                <div className="relative">
                  <div
                    className="flex gap-5 mx-5 rounded-full items-center overflow-x-auto whitespace-nowrap scrollbar-hide mt-3 scroll-smooth"
                    style={{ scrollbarWidth: "none" }}
                    ref={movieRef}>
                    {knownFor
                      .filter((item) => item.media_type === "movie")
                      .map((movie, index) => (
                        <Link
                          to={`/result/movie/${movie.id}`}
                          key={`knownFor-movie-${movie.id}-${index}`}>
                          <Card3
                            img={
                              movie.poster_path
                                ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                                : "/noimg.svg"
                            }
                          />
                        </Link>
                      ))}
                  </div>
                  {/* Scroll buttons */}
                  <button
                    onClick={() => scrollLeft(movieRef)}
                    className="absolute top-1/2 left-0 transform -translate-y-1/2  text-5xl text-white  rounded-full">
                    &#8249;
                  </button>
                  <button
                    onClick={() => scrollRight(movieRef)}
                    className="absolute top-1/2 right-0 transform -translate-y-1/2 text-5xl text-white rounded-full">
                    &#8250;
                  </button>
                </div>
              </div>
            )}

            {/* TV Section */}
            {knownFor.filter((item) => item.media_type === "tv").length > 0 && (
              <div className="mt-5">
                <span className="text-purple-700 font-semibold">TV Shows</span>
                <div className="relative ">
                  <div
                    className="flex gap-5 mx-5 rounded-full items-center overflow-x-auto whitespace-nowrap scrollbar-hide mt-3 scroll-smooth"
                    style={{ scrollbarWidth: "none" }}
                    ref={tvRef}>
                    {knownFor
                      .filter((item) => item.media_type === "tv")
                      .map((tv, index) => (
                        <Link
                          to={`/result/tv/${tv.id}`}
                          key={`knownFor-tv-${tv.id}-${index}`}>
                          <Card3
                            img={
                              tv.poster_path
                                ? `https://image.tmdb.org/t/p/w500/${tv.poster_path}`
                                : "/noimg.svg"
                            }
                          />
                        </Link>
                      ))}
                  </div>
                  {/* Scroll buttons */}
                  <button
                    onClick={() => scrollLeft(tvRef)}
                    className="absolute top-1/2 left-0 transform -translate-y-1/2 text-5xl text-white  rounded-full">
                    &#8249;
                  </button>
                  <button
                    onClick={() => scrollRight(tvRef)}
                    className="absolute top-1/2 right-0 transform -translate-y-1/2 text-5xl  text-white  rounded-full">
                    &#8250;
                  </button>
                </div>
              </div>
            )}

            {/* If there are no known movies or TV shows */}
            {knownFor.filter((item) => item.media_type === "movie").length ===
              0 &&
              knownFor.filter((item) => item.media_type === "tv").length ===
                0 && <p>No known movies or TV shows available.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultInfo;
