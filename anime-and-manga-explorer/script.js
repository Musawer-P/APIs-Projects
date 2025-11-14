const searchInput = document.getElementById("search-bar");
const bodyContainer = document.querySelector(".body-container");

// Fetch Anime from Jikan API
async function fetchAnime(query) {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=1`);
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching anime:", error);
    return [];
  }
}

function renderAnime(animeList) {
  bodyContainer.innerHTML = "";

  if (animeList.length === 0) {
    bodyContainer.innerHTML = `<p style="color: gray;">No results found.</p>`;
    return;
  }

  const anime = animeList[0]; 

  const cardHTML = `
    <div class="card">
        <div class="card-2">
            <img src="${anime.images.jpg.image_url}" id="image">

            <div class="description">
                <div class="title">
                    <h2 id="h2-movie-name">${anime.title}</h2>
                    <p id="movie-description">${anime.synopsis || "No description available."}</p>
                </div>

                <div class="row">
                    <div class="genre">
                        <p id="genre-p">${anime.genres.map(g => g.name).join(", ")}</p>
                    </div>

                    <div class="time">
                        <p id="movie-time">${anime.episodes ? anime.episodes + " episodes" : "Unknown"}</p>
                    </div>

                    <div class="rating">
                        <p id="rating-p">Score: ${anime.score || "N/A"}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `;

  bodyContainer.innerHTML = cardHTML;
}

searchInput.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (!query) return;

    bodyContainer.innerHTML = `<p style="color: gray;">Loading...</p>`;

    const animeList = await fetchAnime(query);
    renderAnime(animeList);
  }
});
