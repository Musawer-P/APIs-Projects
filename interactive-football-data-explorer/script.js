 const API_KEY = ""; // your football-data.org API key
    const API_URL = "https://api.football-data.org/v4/teams";

    const searchBox = document.getElementById("searchBox");
    const results = document.getElementById("results");

    searchBox.addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        let query = searchBox.value.trim();
        if (!query) return;
        fetchTeam(query);
      }
    });

    async function fetchTeam(teamName) {
      results.innerHTML = "<p>Loading...</p>";
      try {
        let teamId;
        if (teamName.toLowerCase() === "real madrid") teamId = 86;
        else if (teamName.toLowerCase() === "barcelona") teamId = 81;
        else if (teamName.toLowerCase() === "manchester united") teamId = 66;
        else if (teamName.toLowerCase() === "bayern") teamId = 5;
        else {
          results.innerHTML = `<p>Sorry, only a few demo teams are available in this version. Try: Real Madrid, Barcelona, Manchester United, Bayern.</p>`;
          return;
        }

        const res = await fetch(`${API_URL}/${teamId}`, {
          headers: { "X-Auth-Token": API_KEY }
        });
        const data = await res.json();
        displayTeam(data);

        // Demo: load live match & first player stats (for radar)
        getLiveMatch(327237); // replace with a real match ID from the API
        if (data.squad.length > 0) getPlayerStats(data.squad[0].id); // first player
      } catch (err) {
        console.error(err);
        results.innerHTML = "<p>Error fetching data.</p>";
      }
    }

    function displayTeam(team) {
      results.innerHTML = `
        <div class="card">
          <img src="${team.crest}" alt="Logo" class="team-logo">
          <h2>${team.name}</h2>
          <p><strong>Founded:</strong> ${team.founded}</p>
          <p><strong>Stadium:</strong> ${team.venue}</p>
          <h3>Squad</h3>
          <ul>
            ${team.squad.slice(0, 5).map(player => `<li>${player.name} - ${player.position}</li>`).join("")}
          </ul>
        </div>
      `;
    }

    // =============== Feature 1: Live Match Tracker ===============
    async function getLiveMatch(matchId) {
      try {
        const response = await fetch(`https://api.football-data.org/v4/matches/${matchId}`, {
          headers: { "X-Auth-Token": API_KEY }
        });
        const data = await response.json();
        const match = data.match;

        document.getElementById("score").innerText =
          `${match.homeTeam.name} ${match.score.fullTime.home ?? 0} - ${match.score.fullTime.away ?? 0} ${match.awayTeam.name}`;

        const eventsContainer = document.getElementById("events");
        eventsContainer.innerHTML = "";
        if (match.events) {
          match.events.forEach(event => {
            const item = document.createElement("li");
            item.innerText = `${event.minute}' - ${event.team.name}: ${event.type} (${event.player.name})`;
            eventsContainer.appendChild(item);
          });
        } else {
          eventsContainer.innerHTML = "<li>No live events found.</li>";
        }
      } catch (err) {
        console.error("Live match error:", err);
      }
    }
    // Auto-refresh every 30s
    setInterval(() => getLiveMatch(327237), 30000);

    // =============== Feature 2: Player Radar Chart ===============
    async function getPlayerStats(playerId) {
      try {
        // football-data.org has limited player stats; for demo, mock some numbers
        const stats = {
          goals: Math.floor(Math.random() * 10),
          assists: Math.floor(Math.random() * 10),
          dribbles: Math.floor(Math.random() * 20),
          passes: Math.floor(Math.random() * 200),
          tackles: Math.floor(Math.random() * 30)
        };

        const chartData = {
          labels: ["Goals", "Assists", "Dribbles", "Passes", "Tackles"],
          datasets: [{
            label: "Player Stats",
            data: [stats.goals, stats.assists, stats.dribbles, stats.passes, stats.tackles],
            backgroundColor: "rgba(0, 128, 255, 0.4)",
            borderColor: "rgba(0, 128, 255, 1)"
          }]
        };

        new Chart(document.getElementById("playerChart"), {
          type: "radar",
          data: chartData,
          options: { scales: { r: { beginAtZero: true } } }
        });
      } catch (err) {
        console.error("Player stats error:", err);
      }
    }