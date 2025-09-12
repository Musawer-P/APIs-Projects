const API_KEY = "";
const BASE_URL = "https://api.themoviedb.org/3";

// DOM Elements
const exploreBtn = document.getElementById("get-started");
const searchInput = document.getElementById("email");
const movieTitle = document.getElementById("movie-head");
const movieDesc = document.querySelector(".explore-desc p");
const moviePoster = document.querySelector(".merging-div img");
const movieRating = document.getElementById("movie-rating");
const movieHour = document.getElementById("movie-hour");
const posterList = document.getElementById("poster-list");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

// Search Movie
async function searchMovie(query) {
  try {
    const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      displayMovie(data.results[0]); // Show first matched movie
    } else {
      alert("No movies found!");
    }
  } catch (err) {
    console.error("Error fetching movie:", err);
  }
}

async function displayMovie(movie) {
  movieTitle.textContent = movie.title;
  movieDesc.textContent = movie.overview || "No description available.";
  moviePoster.src = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "images/poster.jpg"; // fallback

  movieRating.textContent = `${movie.vote_average.toFixed(1)}/10 IMDb`;

  // Fetch runtime details
  try {
    const res = await fetch(`${BASE_URL}/movie/${movie.id}?api_key=${API_KEY}`);
    const details = await res.json();
    if (details.runtime) {
      movieHour.textContent = `${(details.runtime / 60).toFixed(1)}-hr`;
    } else {
      movieHour.textContent = "N/A";
    }
  } catch {
    movieHour.textContent = "N/A";
  }
}

async function loadTrending() {
  try {
    const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    const data = await res.json();
    posterList.innerHTML = ""; // Clear default

    data.results.slice(0, 10).forEach((movie, index) => {
      const div = document.createElement("div");
      div.classList.add("poster-p");

      div.innerHTML = `
        <img src="${movie.poster_path ? "https://image.tmdb.org/t/p/w500" + movie.poster_path : "images/poster.jpg"}" id="poster">
        <p id="poster-p1">${index + 1}</p>
      `;

      div.addEventListener("click", () => displayMovie(movie));

      posterList.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading trending movies:", err);
  }
}

rightBtn.addEventListener("click", () => {
  posterList.scrollBy({ left: 300, behavior: "smooth" });
});
leftBtn.addEventListener("click", () => {
  posterList.scrollBy({ left: -300, behavior: "smooth" });
});

exploreBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    searchMovie(query);
  } else {
    alert("Please enter a movie name!");
  }
});

// ===== On Load =====
loadTrending();
