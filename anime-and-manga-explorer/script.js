const searchBox = document.getElementById("searchBox");
const results = document.getElementById("results");
const genreFilter = document.getElementById("genreFilter"); // Dropdown for genres
const randomBtn = document.getElementById("randomBtn"); // Random Anime button
const favoritesSection = document.getElementById("favorites"); // Section for favorites

// Fetch Anime with optional genre filter
async function fetchAnime(query, genre = "") {
  try {
    let url = `https://api.jikan.moe/v4/anime?q=${query}&limit=10`;
    if (genre) url += `&genres=${genre}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching anime:", error);
    return [];
  }
}

// Fetch a random anime
async function fetchRandomAnime() {
  try {
    const res = await fetch("https://api.jikan.moe/v4/random/anime");
    const data = await res.json();
    return [data.data]; // return as array for rendering
  } catch (error) {
    console.error("Error fetching random anime:", error);
    return [];
  }
}

// Render anime results
function renderResults(animeList) {
  results.innerHTML = "";

  if (animeList.length === 0) {
    results.innerHTML = "<p class='text-gray-600'>No results found.</p>";
    return;
  }

  animeList.forEach(anime => {
    const card = document.createElement("div");
    card.className = "anime-card";

    card.innerHTML = `
      <img src="${anime.images.jpg.image_url}" alt="${anime.title}" class="poster"/>
      <div class="info">
        <h3>${anime.title}</h3>
        <p><strong>Type:</strong> ${anime.type || "Unknown"}</p>
        <p><strong>Episodes:</strong> ${anime.episodes || "?"}</p>
        <p><strong>Score:</strong> ⭐ ${anime.score || "N/A"}</p>
        <a href="${anime.url}" target="_blank">More Info</a>
        <button class="fav-btn">❤️ Add to Favorites</button>
      </div>
    `;

    // Add to favorites
    card.querySelector(".fav-btn").addEventListener("click", () => {
      addToFavorites(anime);
    });

    results.appendChild(card);
  });
}

// Favorites handling with LocalStorage
function addToFavorites(anime) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.find(a => a.mal_id === anime.mal_id)) {
    favorites.push(anime);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
  }
}

function renderFavorites() {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favoritesSection.innerHTML = "<h2>⭐ Favorites</h2>";

  favorites.forEach(anime => {
    const favCard = document.createElement("div");
    favCard.className = "fav-card";
    favCard.innerHTML = `
      <p>${anime.title}</p>
      <button class="remove-btn">❌</button>
    `;

    favCard.querySelector(".remove-btn").addEventListener("click", () => {
      removeFromFavorites(anime.mal_id);
    });

    favoritesSection.appendChild(favCard);
  });
}

function removeFromFavorites(id) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter(a => a.mal_id !== id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavorites();
}

// Search on "Enter"
searchBox.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    let query = searchBox.value.trim();
    let genre = genreFilter.value;
    if (!query) return;
    results.innerHTML = "<p class='text-gray-600'>Loading...</p>";
    const animeList = await fetchAnime(query, genre);
    renderResults(animeList);
  }
});

genreFilter.addEventListener("change", async () => {
  let query = searchBox.value.trim();
  let genre = genreFilter.value;
  if (!query) return;
  results.innerHTML = "<p class='text-gray-600'>Loading...</p>";
  const animeList = await fetchAnime(query, genre);
  renderResults(animeList);
});

// Random Anime Button
randomBtn.addEventListener("click", async () => {
  results.innerHTML = "<p class='text-gray-600'>Loading Random Anime...</p>";
  const randomAnime = await fetchRandomAnime();
  renderResults(randomAnime);
});

// Initial load favorites
renderFavorites();
