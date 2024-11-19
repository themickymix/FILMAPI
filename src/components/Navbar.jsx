import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { options } from "../constant";

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]); // Store the search suggestions
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false); // Manage the visibility of suggestions
  const suggestionRef = useRef(null); // Ref for suggestion list container
  const navigate = useNavigate();

  const handleLinkClick = () => {
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const fetchSuggestions = async () => {
    if (searchQuery.trim() === "") {
      setSuggestions([]);
      setIsSuggestionsOpen(false); // Close suggestions if query is empty
      return; // Don't fetch if search query is empty
    }

    setIsLoading(true); // Show loading state

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
          searchQuery
        )}&page=1`, // Always fetch from page 1
        options
      );
      const data = await response.json();

      setSuggestions(data.results); // Set the fetched suggestions
      setTotalPages(data.total_pages); // Set total pages based on API response
      setIsSuggestionsOpen(true); // Open suggestions list
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false); // Stop loading state
    }
  };

  // Debounce searchQuery changes to optimize API calls
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      fetchSuggestions();
    }, 300); // 300ms debounce time

    return () => clearTimeout(debounceTimeout); // Cleanup previous timeout on query change
  }, [searchQuery]);

  const handleSearch = (event) => {
    if (event.key === "Enter" && searchQuery.trim()) {
      navigate(`/results?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(""); // Clear the search input after submitting
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name || suggestion.title || suggestion.id); // Set search input to the selected suggestion
    navigate(
      `/results?query=${encodeURIComponent(
        suggestion.name || suggestion.title || suggestion.id
      )}`
    );
    setSuggestions([]);
    setSearchQuery("");
    setIsSuggestionsOpen(false); // Close the suggestions list after selecting a suggestion
  };

  // Close suggestions list if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target)
      ) {
        setIsSuggestionsOpen(false); // Close the suggestions list
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-wrap justify-center">
      <div className="md:px-[15%] navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
              onClick={toggleDropdown}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </div>
            {isDropdownOpen && (
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                <li>
                  <Link to="/" onClick={handleLinkClick}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/movie" onClick={handleLinkClick}>
                    Movie
                  </Link>
                </li>
                <li>
                  <Link to="/tv" onClick={handleLinkClick}>
                    TV Series
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>

        <div className="navbar-center relative">
          <label className="input w-60 md:w-96 input-bordered flex items-center gap-2">
            <input
              type="text"
              className="grow text-xs text-center"
              placeholder="Movies, TV Shows & Artist"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update state on change
              onKeyDown={handleSearch} // Trigger search on Enter key
            />

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70">
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
        </div>

        <div className="navbar-end">
          <button className="btn btn-ghost btn-circle">
            <div className="indicator">
              <Link to="/" onClick={handleLinkClick}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </Link>
            </div>
          </button>
        </div>
      </div>

      {isSuggestionsOpen && suggestions.length > 0 && searchQuery.trim() && (
        <ul
          ref={suggestionRef} // Attach ref to suggestion list container
          className="absolute z-10 mt-16 bg-base-100 w-60 md:w-96 shadow-2xl rounded-md max-h-60 overflow-auto"
          style={{ scrollbarWidth: "none" }}>
          {suggestions.map((suggestion) => {
            // Extract the release year from the date
            const date = (
              suggestion.release_date ||
              suggestion.first_air_date ||
              ""
            ).split("-")[0];
            const mediaType = suggestion.media_type || "";
      const formattedMediaType =
        mediaType === "tv"
          ? " • TV Show"
          : mediaType === "person"
          ? "Artist"
          : mediaType === "movie"
          ? " • Movie"
          : mediaType
          ? mediaType.charAt(0).toUpperCase() + mediaType.slice(1).toLowerCase()
          : "Unknown";


            return (
              <Link
                to={`/result/${suggestion.media_type || "movie"}/${
                  suggestion.id
                }`}
                key={suggestion.id}>
                <li
                  className="p-2 text-sm hover:bg-base-200 cursor-pointer "
                  onClick={() => handleSuggestionClick(suggestion)}>
                  <div className="flex gap-5">
                    {/* Poster Image */}
                    <img
                      className="w-12 rounded-md bg-white"
                      src={
                        suggestion.poster_path || suggestion.profile_path
                          ? `https://image.tmdb.org/t/p/w500/${
                              suggestion.poster_path || suggestion.profile_path
                            }`
                          : "/noimg.svg"
                      }
                    />

                    {/* Suggestion Details */}
                    <div>
                      <span className="flex flex-col">
                        {suggestion.name || suggestion.title || "Untitled"}
                      </span>
                      <span className="flex gap-2">
                        {date}
                        {formattedMediaType}
                      </span>
                    </div>
                  </div>
                </li>
              </Link>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Navbar;
