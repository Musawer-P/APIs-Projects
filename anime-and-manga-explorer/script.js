
const searchBox = document.getElementById("searchBox");
const results = document.getElementById("results");

async function fetchAnime(query) {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=10`);
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching anime:", error);
    return [];
  }
}

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
      </div>
    `;

    results.appendChild(card);
  });
}

// Search on "Enter"
searchBox.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    let query = searchBox.value.trim();
    if (!query) return;
    results.innerHTML = "<p class='text-gray-600'>Loading...</p>";
    const animeList = await fetchAnime(query);
    renderResults(animeList);
  }
});