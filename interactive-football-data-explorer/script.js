const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sortSelect");

const playerNameEl = document.getElementById("player-name");
const playerAgeEl = document.getElementById("player-age");
const playerNationalityEl = document.getElementById("player-nationality");
const playerImgEl = document.getElementById("player-img");

const teamDivEl = document.getElementById("team-div");

// Base URL for TheSportsDB free API
const API_BASE = "https://www.thesportsdb.com/api/v1/json/3";
async function fetchPlayer(playerName) {
  try {
    const res = await fetch(`${API_BASE}/searchplayers.php?p=${encodeURIComponent(playerName)}`);
    const data = await res.json();

    if (!data.player || data.player.length === 0) {
      alert("Player not found!");
      return;
    }

    const player = data.player[0];

    // Update Player Info
    playerNameEl.textContent = player.strPlayer;
    playerAgeEl.textContent = player.dateBorn
      ? new Date().getFullYear() - new Date(player.dateBorn).getFullYear()
      : "N/A";
    playerNationalityEl.textContent = player.strNationality || "N/A";
    playerImgEl.src = player.strThumb || "salah.png";

    const playerTeamEl = document.getElementById("player-team");
    if (playerTeamEl) {
      playerTeamEl.textContent = "Team: " + (player.strTeam || "N/A");
    }

  } catch (err) {
    console.error(err);
    alert("Error fetching player data!");
  }
}




async function fetchTeam(teamName) {
  try {
    // Step 1: get team info
    const res = await fetch(`${API_BASE}/searchteams.php?t=${encodeURIComponent(teamName)}`);
    const data = await res.json();

    if (!data.teams) return alert("Team not found!");
    const team = data.teams[0];

    // Update Team info
    teamDivEl.querySelector(".player-list .list2 #name").textContent = team.strTeam || "N/A";
    teamDivEl.querySelector(".player-list .list2 #position").textContent = "Team";

    // Update player info placeholders
    playerNameEl.textContent = "N/A";
    playerAgeEl.textContent = "-";
    playerNationalityEl.textContent = "-";
    playerImgEl.src = team.strTeamBadge || "salah.png";

    // Display team description
    let descriptionEl = document.getElementById("team-description");
    if (!descriptionEl) {
      descriptionEl = document.createElement("p");
      descriptionEl.id = "team-description";
      descriptionEl.style.marginTop = "10px"; // optional styling
      teamDivEl.appendChild(descriptionEl);
    }
    descriptionEl.textContent = team.strDescriptionEN || "No description available.";

    // Step 2: get all players
    const rosterRes = await fetch(`${API_BASE}/lookup_all_players.php?id=${team.idTeam}`);
    const rosterData = await rosterRes.json();

    const playerListDiv = document.querySelector(".player-list");
    playerListDiv.innerHTML = ""; // clear previous players

    if (rosterData.player) {
      rosterData.player.forEach(player => {
        const playerDiv = document.createElement("div");
        playerDiv.classList.add("list2");
        playerDiv.innerHTML = `
          <p id="number">${player.strNumber || "-"}</p>
          <div class="name-pos">
            <p id="name">${player.strPlayer}</p>
            <p id="position">${player.strPosition || "-"}</p>
          </div>
        `;
        playerListDiv.appendChild(playerDiv);
      });
    } else {
      playerListDiv.innerHTML = "<p>No players found</p>";
    }

    await fetchFutureMatches(team.idTeam);
await fetchPastMatches(team.idTeam);

  } catch (err) {
    console.error(err);
    alert("Error fetching team data!");
  }
}


//Future matches are from TheSportsDB API and may not be fully accurate
async function fetchFutureMatches(teamId) {
  try {
    const res = await fetch(`${API_BASE}/eventsnext.php?id=${teamId}`);
    const data = await res.json();

    const matchesContainer = document.querySelector(".recent-view-matches");
    matchesContainer.innerHTML = "<h1>Future Matches</h1>";

    if (!data.events) {
      matchesContainer.innerHTML += "<p>No upcoming matches found</p>";
      return;
    }

    data.events.forEach(match => {
      const matchDiv = document.createElement("div");
      matchDiv.classList.add("matches1");
      matchDiv.innerHTML = `
        <div class="one">
          <p id="club-name">${match.strHomeTeam}</p>
          <p>vs</p>
          <p id="club-name">${match.strAwayTeam}</p>
        </div>
        <p>Date: ${match.dateEvent || "-"} Time: ${match.strTime || "-"}</p>
      `;
      matchesContainer.appendChild(matchDiv);
    });
  } catch (err) {
    console.error(err);
  }
}



async function fetchPastMatches(teamId) {
  try {
    const res = await fetch(`${API_BASE}/eventslast.php?id=${teamId}`);
    const data = await res.json();

    const pastMatchesDiv = document.querySelector(".view-matches");
    if (!pastMatchesDiv) return;

    pastMatchesDiv.innerHTML = ""; // clear old matches

    if (!data.results) {
      pastMatchesDiv.innerHTML = "<p>No recent matches found</p>";
      return;
    }

    data.results.forEach(match => {
      const matchDiv = document.createElement("div");
      matchDiv.classList.add("one-match");
      matchDiv.innerHTML = `
            <h1>Past Matches</h1>

        <p>${match.strEvent}</p>
        <p>${match.dateEvent} | ${match.intHomeScore}-${match.intAwayScore}</p>
        <p>League: ${match.strLeague}</p>
      `;
      pastMatchesDiv.appendChild(matchDiv);
    });
  } catch (err) {
    console.error(err);
  }
}





// Event listener
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  const type = sortSelect.value;

  if (!query) return alert("Please enter a player or team name");

  if (type === "player") {
    fetchPlayer(query);
  } else if (type === "team") {
    fetchTeam(query);
  } else {
    alert("Please select Player or Team");
  }
});
