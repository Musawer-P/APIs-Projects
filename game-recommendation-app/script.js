const apiKey = "f6f6cd1f74e048bba274d734063de5e9";
const searchBtn = document.getElementById("searchBtn");
const randomBtn = document.getElementById("randomBtn");
const genreInput = document.getElementById("genreInput");
const gameResults = document.getElementById("gameResults");

async function fetchGames(query = "") {
  const url = query
    ? `https://api.rawg.io/api/games?key=${apiKey}&search=${query}`
    : `https://api.rawg.io/api/games?key=${apiKey}&page_size=40`;

  const res = await fetch(url);
  const data = await res.json();
  return data.results || [];
}

async function fetchGameDetails(id) {
  const res = await fetch(`https://api.rawg.io/api/games/${id}?key=${apiKey}`);
  return await res.json();
}

function renderGame(game) {
  gameResults.innerHTML = `
    <div class="row">
      <div class="images">
        <img src="${game.background_image || 'images/default.jpg'}" id="poster" alt="${game.name}">
      </div>

      <div class="name-desc">
        <h1>${game.name}</h1>
        <p>${game.description_raw ? game.description_raw.slice(0, 300) + '...' : 'No description available.'}</p>
        <div class="rating-other">
          <div class="row1">
            <p>Developer</p>
            <p>${game.developers?.[0]?.name || 'Unknown'}</p>
          </div>
          <div class="row2">
            <p>Rating</p>
            <p>${game.rating || 'N/A'}</p>
          </div>
          <div class="row3">
            <p>Released</p>
            <p>${game.released || 'Unknown'}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

let allGames = [];

searchBtn.addEventListener("click", async () => {
  const query = genreInput.value.trim();
  if (!query) return;

  gameResults.innerHTML = "<p>Loading...</p>";

  const games = await fetchGames(query);
  if (games.length === 0) {
    gameResults.innerHTML = "<p>No games found.</p>";
    return;
  }

  const details = await fetchGameDetails(games[0].id);
  renderGame(details);
});

randomBtn.addEventListener("click", async () => {
  gameResults.innerHTML = "<p>Loading random game...</p>";

  if (allGames.length === 0) {
    allGames = await fetchGames();
  }

  const randomGame = allGames[Math.floor(Math.random() * allGames.length)];
  const details = await fetchGameDetails(randomGame.id);
  renderGame(details);
});
