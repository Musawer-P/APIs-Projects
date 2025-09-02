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

    // Demo: let’s  Real Madrid (id: 86) if user types "real madrid"

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