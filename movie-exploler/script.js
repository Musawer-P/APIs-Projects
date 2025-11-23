const API_KEY = "8ef114fc";
const BASE_URL = "https://www.omdbapi.com/";

// DOM Elements
const exploreBtn = document.getElementById("get-started");
const searchInput = document.getElementById("email");
const movieTitle = document.getElementById("movie-head");
const movieDesc = document.querySelector(".explore-desc p");
const moviePoster = document.querySelector(".merging-div img");
const movieRating = document.getElementById("movie-rating");
const movieHour = document.getElementById("movie-hour");

// Search Movie (OMDb)
async function searchMovie(query) {
  try {
    const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&t=${query}`);
    const movie = await res.json();

    if (movie.Response === "False") {
      alert("No movies found!");
      return;
    }

    displayMovie(movie);
  } catch (err) {
    console.error("Error fetching movie:", err);
  }
}

// Display Movie (OMDb fields)
function displayMovie(movie) {
  movieTitle.textContent = movie.Title;
  movieDesc.textContent = movie.Plot || "No description available.";

  moviePoster.src = movie.Poster && movie.Poster !== "N/A"
    ? movie.Poster
    : "images/poster.jpg";

  movieRating.textContent = `${movie.imdbRating}/10 IMDb`;

  movieHour.textContent = movie.Runtime || "N/A";
}

// Run search
exploreBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    searchMovie(query);
  } else {
    alert("Please enter a movie name!");
  }
});
