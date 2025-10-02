 const resultsDiv = document.getElementById("results");

    document.getElementById("runBtn").addEventListener("click", async () => {
      const project = document.getElementById("projectSelect").value;
      const query = document.getElementById("queryInput").value.trim();
      if (!project || !query) {
        resultsDiv.innerHTML = "<p>Please select a project and enter a query.</p>";
        return;
      }

      resultsDiv.innerHTML = "<p>Loading...</p>";

      try {
        let data;

        // Different API calls depending on project
        if (project === "games") {
          // Example: RAWG.io API
          const res = await fetch(`https://api.rawg.io/api/games?key=YOUR_API_KEY&search=${query}`);
          data = await res.json();
          resultsDiv.innerHTML = data.results.map(g => `<p>${g.name}</p>`).join("");

        } else if (project === "weather") {
          // Example: OpenWeatherMap API
          const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=YOUR_API_KEY&units=metric`);
          data = await res.json();
          resultsDiv.innerHTML = `<p>${data.name}: ${data.main.temp}°C, ${data.weather[0].description}</p>`;

        } else if (project === "news") {
          // Example: NewsAPI
          const res = await fetch(`https://newsapi.org/v2/everything?q=${query}&apiKey=YOUR_API_KEY`);
          data = await res.json();
          resultsDiv.innerHTML = data.articles.map(a => `<p><a href="${a.url}" target="_blank">${a.title}</a></p>`).join("");

        } else if (project === "books") {
          // Example: Google Books API
          const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
          data = await res.json();
          resultsDiv.innerHTML = data.items.map(b => `<p>${b.volumeInfo.title}</p>`).join("");
        }

      } catch (err) {
        resultsDiv.innerHTML = `<p>Error: ${err.message}</p>`;
      }
    });