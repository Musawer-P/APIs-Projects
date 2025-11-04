  const select = document.getElementById("sortSelect");
  const playerDiv = document.getElementById("player-info-main");
  const teamDiv = document.getElementById("team-div");

  select.addEventListener("change", function () {
    const value = this.value;

    if (value === "player") {
      playerDiv.style.display = "flex";
      teamDiv.style.display = "none";
    } else if (value === "team") {
      teamDiv.style.display = "flex";
      playerDiv.style.display = "none";
    } else {
      playerDiv.style.display = "none";
      teamDiv.style.display = "none";
    }
  });





const API_KEY = ""; 
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
    getLiveMatch(327237); // replace with a real match ID from API
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

async function getPlayerStats(playerId) {
  try {
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

//
// ===== New Feature 1: Head-to-Head Predictor =====
//
async function fetchHeadToHead(team1, team2) {
  const res = await fetch(`https://api.football-data.org/v4/matches?competitions=CL,PL,PD,SA,BL1&status=FINISHED&limit=20`, {
    headers: { "X-Auth-Token": API_KEY }
  });
  const data = await res.json();

  const matches = data.matches.filter(
    m => (m.homeTeam.id == team1 && m.awayTeam.id == team2) ||
         (m.homeTeam.id == team2 && m.awayTeam.id == team1)
  );

  let stats = { [team1]: 0, [team2]: 0, draws: 0 };
  matches.forEach(m => {
    if (m.score.winner === "HOME_TEAM") stats[m.homeTeam.id]++;
    else if (m.score.winner === "AWAY_TEAM") stats[m.awayTeam.id]++;
    else stats.draws++;
  });

  const total = matches.length || 1;
  const team1Chance = Math.round((stats[team1] / total) * 100);
  const team2Chance = Math.round((stats[team2] / total) * 100);

  document.getElementById("h2hResults").innerHTML = `
    <p>Matches Analyzed: ${matches.length}</p>
    <p>Team ${team1} Wins: ${stats[team1]}</p>
    <p>Team ${team2} Wins: ${stats[team2]}</p>
    <p>Draws: ${stats.draws}</p>
    <h3>Prediction:</h3>
    <p>Team ${team1}: ${team1Chance}% chance</p>
    <p>Team ${team2}: ${team2Chance}% chance</p>
  `;
}

document.getElementById("compareBtn").addEventListener("click", () => {
  const team1 = document.getElementById("team1").value;
  const team2 = document.getElementById("team2").value;
  if (team1 && team2) fetchHeadToHead(team1, team2);
});

//
//
let compareRadarChart;
async function fetchPlayerStats(playerId) {
  return {
    name: "Player " + playerId,
    goals: Math.floor(Math.random() * 10),
    assists: Math.floor(Math.random() * 10),
    passes: Math.floor(Math.random() * 200),
    tackles: Math.floor(Math.random() * 30),
    shots: Math.floor(Math.random() * 50)
  };
}

async function showRadarChart() {
  const id1 = document.getElementById("playerId1").value;
  const id2 = document.getElementById("playerId2").value;

  if (!id1) return;

  const stats1 = await fetchPlayerStats(id1);
  const datasets = [{
    label: stats1.name,
    data: [stats1.goals, stats1.assists, stats1.passes, stats1.tackles, stats1.shots],
    fill: true,
    backgroundColor: "rgba(54, 162, 235, 0.2)",
    borderColor: "rgba(54, 162, 235, 1)"
  }];

  if (id2) {
    const stats2 = await fetchPlayerStats(id2);
    datasets.push({
      label: stats2.name,
      data: [stats2.goals, stats2.assists, stats2.passes, stats2.tackles, stats2.shots],
      fill: true,
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)"
    });
  }

  const ctx = document.getElementById("compareRadar").getContext("2d");
  if (compareRadarChart) compareRadarChart.destroy();

  compareRadarChart = new Chart(ctx, {
    type: "radar",
    data: {
      labels: ["Goals", "Assists", "Passes", "Tackles", "Shots"],
      datasets: datasets
    },
    options: { responsive: true, scales: { r: { beginAtZero: true } } }
  });
}

document.getElementById("comparePlayers").addEventListener("click", showRadarChart);