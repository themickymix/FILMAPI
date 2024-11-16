import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // Import and initialize useNavigate

  const handleLinkClick = () => {
    // Close the dropdown when a link is clicked
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    // Toggle dropdown visibility on button click
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearch = (event) => {
    if (event.key === "Enter" && searchQuery) {
      setSearchQuery(""); // Clear search input after submitting
      navigate(`/results?query=${encodeURIComponent(searchQuery)}`); // Navigate to results page
    }
  };

  return (
    <div className="md:px-[15%] navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle"
            onClick={toggleDropdown} // Toggle the dropdown when the button is clicked
          >
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
      <div className="navbar-center">
        <label className="input w-60 md:w-96 input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow text-xs"
            placeholder="Search Movies, TV Shows & Person"
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
  );
}

export default Navbar;
