const clientId = "";
const clientSecret = "";
let token = "";

// Get Spotify Access Token
async function getToken() {
  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + btoa(clientId + ":" + clientSecret)
    },
    body: "grant_type=client_credentials"
  });
  const data = await result.json();
  token = data.access_token;
}

// Search for Tracks
async function search() {
  const query = document.getElementById("searchInput").value;
  const result = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, {
    method: "GET",
    headers: { "Authorization": "Bearer " + token }
  });
  const data = await result.json();
  displayResults(data.tracks.items);
}

// Display Tracks
function displayResults(tracks) {
  const container = document.getElementById("results");
  container.innerHTML = "";
  tracks.forEach(track => {
    const div = document.createElement("div");
    div.classList.add("track");
    div.innerHTML = `
      <img src="${track.album.images[0].url}" alt="Album Cover">
      <h4>${track.name}</h4>
      <p>${track.artists.map(a => a.name).join(", ")}</p>
      ${track.preview_url 
        ? `<audio controls src="${track.preview_url}"></audio>` 
        : "<p>No preview available</p>"}
    `;
    container.appendChild(div);
  });
}



// Play Full Track via Spotify Embed
div.innerHTML = `
  <img src="${track.album.images[0].url}" alt="Album Cover">
  <h4>${track.name}</h4>
  <p>${track.artists.map(a => a.name).join(", ")}</p>
  ${track.preview_url 
    ? `<audio controls src="${track.preview_url}"></audio>` 
    : "<p>No preview available</p>"}
  <button onclick="window.open('${track.external_urls.spotify}', '_blank')">Play on Spotify</button>
`;


//  Saving Favorite Tracks (LocalStorage Playlist)

function addToFavorites(track) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites.push(track);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  displayFavorites();
}

function displayFavorites() {
  const favContainer = document.getElementById("favorites");
  favContainer.innerHTML = "<h3>My Playlist</h3>";
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites.forEach(track => {
    const div = document.createElement("div");
    div.classList.add("track");
    div.innerHTML = `
      <img src="${track.album.images[0].url}" alt="Album Cover">
      <h4>${track.name}</h4>
      <p>${track.artists.map(a => a.name).join(", ")}</p>
    `;
    favContainer.appendChild(div);
  });
}


// Infinite Scroll (Load More Results)

let nextUrl = "";

async function search(initial = true) {
  const query = document.getElementById("searchInput").value;
  const url = initial 
    ? `https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`
    : nextUrl;

  const result = await fetch(url, {
    method: "GET",
    headers: { "Authorization": "Bearer " + token }
  });
  const data = await result.json();
  displayResults(data.tracks.items, !initial);
  nextUrl = data.tracks.next; 
}

function displayResults(tracks, append = false) {
  const container = document.getElementById("results");
  if (!append) container.innerHTML = "";
  tracks.forEach(track => {
    const div = document.createElement("div");
    div.classList.add("track");
    div.innerHTML = `
      <img src="${track.album.images[0].url}" alt="Album Cover">
      <h4>${track.name}</h4>
      <p>${track.artists.map(a => a.name).join(", ")}</p>
    `;
    container.appendChild(div);
  });
}

// Auto load more when scrolling
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    if (nextUrl) search(false);
  }
});


getToken();