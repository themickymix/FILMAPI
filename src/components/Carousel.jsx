import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for React Router v6
import { options } from "../constant";
const Carousel = () => {
  const [slides, setSlides] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Use useNavigate hook for navigation in React Router v6
  const navigate = useNavigate();

  // Fetch data from the API
  useEffect(() => {

    fetch(
      "https://api.themoviedb.org/3/trending/all/day?language=en-US",
      options
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.results) {
          setSlides(data.results.slice(0, 10)); // Get the first 10 items
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Auto-slide logic
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [slides.length, isPaused]);

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handleSlideClick = (item) => {
    // Determine the path based on whether it's a movie or a TV show
    const path =
      item.media_type === "movie"
        ? `/result/movie/${item.id}` // For movies
        : `/result/tv/${item.id}`; // For TV shows

    navigate(path); // Navigate to the corresponding path
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)} // Pause auto-slide on hover
      onMouseLeave={() => setIsPaused(false)} // Resume auto-slide on mouse leave
    >
      {/* Slides container */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${activeIndex * 100}%)`,
        }}>
        {slides.map((slide, index) => (
          <div
            key={slide.id || index}
            className="w-full flex-shrink-0 relative bg-gray-800"
           >
            <button
              onClick={() => handleSlideClick(slide)} // Handle click to navigate
              className="w-full h-full focus:outline-none">
              <img
                src={`https://image.tmdb.org/t/p/original${slide.backdrop_path}`}
                alt={slide.title || slide.name || "Untitled"}
                className="w-full h-full rounded-xl"
              />
            </button>
            <div className="absolute bottom-1 left-1 text-white px-4 py-2">
              <h2 className="text-lg font-bold">
                {slide.title || slide.name || "Untitled"}
              </h2>
              <div className="flex items-center gap-1">
                <p className="text-sm">
                  {new Date(
                    slide.release_date || slide.first_air_date
                  ).getFullYear() || "N/A"}
                </p>
                <p className="text-lg text-white">&bull;</p>
                <p className="text-sm text-gray-300">
                  {slide.media_type === "movie" ? "Movie" : "TV Series"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-4 transform -translate-y-1/2  text-white p-3 ">
        &#8249;
      </button>
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2  text-white p-3">
        &#8250;
      </button>

      {/* Dots navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-2 h-2 rounded-full ${
              index === activeIndex ? "bg-white" : "bg-gray-400"
            } focus:outline-none`}></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
