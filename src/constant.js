export const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
  },
};

export const movieapi = () => {
  return fetch(
    "https://api.themoviedb.org/3/trending/movie/day?language=en-US",
    options
  )
    .then((res) => res.json())
    .then((res) => res.results) // Return the results array
    .catch((err) => {
      console.error("Error fetching trending movies:", err);
      return []; // Return an empty array in case of error
    });
};

export const tvapi = () => {
  return fetch(
    "https://api.themoviedb.org/3/trending/tv/day?language=en-US",
    options
  )
    .then((res) => res.json())
    .then((res) => res.results) // Return the results array
    .catch((err) => {
      console.error("Error fetching trending movies:", err);
      return []; // Return an empty array in case of error
    });
};

export const topmovie = () => {
  return fetch(
    "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
    options
  )
    .then((res) => res.json())
    .then((res) => res.results) // Return the results array
    .catch((err) => {
      console.error("Error fetching trending movies:", err);
      return []; // Return an empty array in case of error
    });
};
export const toptv = () => {
  return fetch(
    "https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1",
    options
  )
    .then((res) => res.json())
    .then((res) => res.results) // Return the results array
    .catch((err) => {
      console.error("Error fetching trending movies:", err);
      return []; // Return an empty array in case of error
    });
};
export const discovermovie = () => {
  return fetch(
    "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc",
    options
  )
    .then((res) => res.json())
    .then((res) => res.results) // Return the results array
    .catch((err) => {
      console.error("Error fetching trending movies:", err);
      return []; // Return an empty array in case of error
    });
};
export const discovertv = () => {
  return fetch(
    "https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc",
    options
  )
    .then((res) => res.json())
    .then((res) => res.results) // Return the results array
    .catch((err) => {
      console.error("Error fetching trending movies:", err);
      return []; // Return an empty array in case of error
    });
};
export const poppeople = () => {
  return fetch(
    "https://api.themoviedb.org/3/person/popular?language=en-US&page=1",
    options
  )
    .then((res) => res.json())
    .then((res) => res.results) // Return the results array
    .catch((err) => {
      console.error("Error fetching trending movies:", err);
      return []; // Return an empty array in case of error
    });
};
