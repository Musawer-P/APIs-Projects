const API_KEY = '77dffc192b2048fa81425c39463889e7';
const BASE_URL = 'https://api.football-data.org/v4';

// DOM Elements
const select = document.getElementById("sortSelect");
const playerDiv = document.getElementById("player-info-main");
const teamDiv = document.getElementById("team-div");
const input = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

// Toggle Player / Team
select.addEventListener("change", () => {
    if (select.value === "player") {
        playerDiv.style.display = "flex";
        teamDiv.style.display = "none";
    } else if (select.value === "team") {
        teamDiv.style.display = "flex";
        playerDiv.style.display = "none";
    } else {
        teamDiv.style.display = "none";
        playerDiv.style.display = "none";
    }
});

// Search button / enter key
searchBtn.addEventListener("click", handleSearch);
input.addEventListener("keypress", (e) => { if (e.key === "Enter") handleSearch(); });

async function handleSearch() {
    const query = input.value.trim();
    const type = select.value;

    if (!query || !type) return alert("Please select Player/Team and type something.");

    if (type === "team") await loadTeam(query);
    if (type === "player") alert("Player search not supported in free API. Use team squad.");
}

async function loadTeam(teamName) {
    try {
        const leagues = ['PL', 'PD', 'BL1']; // Premier League, La Liga, Bundesliga
        let teamId, teamData;

        for (const league of leagues) {
            const res = await fetch(`${BASE_URL}/competitions/${league}/teams`, {
                headers: { 'X-Auth-Token': API_KEY }
            });
            const data = await res.json();

            const team = data.teams.find(t => t.name.toLowerCase().includes(teamName.toLowerCase()));
            if (team) {
                teamId = team.id;

                const teamRes = await fetch(`${BASE_URL}/teams/${teamId}`, {
                    headers: { 'X-Auth-Token': API_KEY }
                });
                teamData = await teamRes.json();
                break;
            }
        }

        if (!teamId) return alert("Team not found in supported leagues.");

        // Clear old data
        document.querySelector(".player-list").innerHTML = "";
        document.querySelector(".trophies-new").innerHTML = "";
        document.querySelector(".recent-view-matches").innerHTML = `<h1>Recent Matches</h1>`;

        // Player List
        teamData.squad.forEach(player => {
            document.querySelector(".player-list").innerHTML += `
                <div class="list1">
                    <p>${player.shirtNumber || '-'}</p>
                    <div class="name-pos">
                        <p>${player.name}</p>
                        <p>${player.position || '-'}</p>
                    </div>
                </div>
            `;
        });

        document.querySelector(".trophies-new").innerHTML = `<p>Trophies data not available in free API</p>`;

        // Recent Matches
        const matchRes = await fetch(`${BASE_URL}/teams/${teamId}/matches?status=FINISHED&limit=5`, {
            headers: { 'X-Auth-Token': API_KEY }
        });
        const matchData = await matchRes.json();

        const matchesContainer = document.querySelector(".recent-view-matches");

        matchData.matches.forEach(match => {
            matchesContainer.innerHTML += `
                <div class="matches1">
                    <div class="one">
                        <p>${match.homeTeam.name}</p>
                        <p>${match.score.fullTime.home ?? '-'}</p>
                    </div>
                    <div class="two">
                        <p>${match.awayTeam.name}</p>
                        <p>${match.score.fullTime.away ?? '-'}</p>
                    </div>
                </div>
            `;
        });

    } catch (err) {
        console.error(err);
        alert("Error fetching team data. Check your API key and usage limits.");
    }
}
