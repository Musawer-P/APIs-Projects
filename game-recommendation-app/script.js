 const apiKey = ""; // getting from https://rawg.io/apidocs
    const resultsDiv = document.getElementById("gameResults");

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

        resultsDiv.innerHTML = data.results.map(game => `
          <div class="card">
            <img src="${game.background_image}" alt="${game.name}" />
            <h3>${game.name}</h3>
            <p>⭐ Rating: ${game.rating}</p>
            <p>Released: ${game.released}</p>
            <p>Platforms: ${game.platforms.map(p => p.platform.name).join(", ")}</p>
          </div>
        `).join("");
      } catch (err) {
        resultsDiv.innerHTML = "<p>⚠️ Error fetching games. Try again.</p>";
      }
    });