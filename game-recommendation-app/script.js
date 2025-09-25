  const apiKey = ""; // 
    const resultsDiv = document.getElementById("gameResults");
    const sortSelect = document.getElementById("sortSelect");
    const randomBtn = document.getElementById("randomBtn");

    document.getElementById("searchBtn").addEventListener("click", async () => {
      const genre = document.getElementById("genreInput").value.trim();
      if (!genre) return;

      resultsDiv.innerHTML = "<p>Loading...</p>";

      try {
        const res = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&genres=${genre}`);
        const data = await res.json();

        if (!data.results || data.results.length === 0) {
          resultsDiv.innerHTML = "<p>No games found for that genre.</p>";
          return;
        }

        window.fetchedGames = data.results;
        displayGames(data.results);

      } catch (err) {
        resultsDiv.innerHTML = "<p>⚠️ Error fetching games. Try again.</p>";
      }
    });

    sortSelect.addEventListener("change", () => {
      if (!window.fetchedGames) return;
      let sorted = [...window.fetchedGames];

      if (sortSelect.value === "rating") {
        sorted.sort((a, b) => b.rating - a.rating);
      } else if (sortSelect.value === "released") {
        sorted.sort((a, b) => new Date(b.released) - new Date(a.released));
      }

      displayGames(sorted);
    });

    randomBtn.addEventListener("click", () => {
      if (!window.fetchedGames) return;
      const randomGame = window.fetchedGames[Math.floor(Math.random() * window.fetchedGames.length)];
      displayGames([randomGame]);
    });

    function displayGames(games) {
      resultsDiv.innerHTML = games.map(game => `
        <div class="card">
          <img src="${game.background_image}" alt="${game.name}" />
          <h3>${game.name}</h3>
          <p>⭐ Rating: ${game.rating}</p>
          <p>Released: ${game.released}</p>
          <p>Platforms: ${game.platforms.map(p => p.platform.name).join(", ")}</p>
        </div>
      `).join("");
    }