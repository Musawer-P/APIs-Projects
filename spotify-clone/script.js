const clientId = ""; 
const clientSecret = ""; 
let token = "";
let nextUrl = "";

async function getToken() {
  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + btoa(clientId + ":" + clientSecret),
    },
    body: "grant_type=client_credentials",
  });

  const data = await result.json();
  token = data.access_token;
}

async function getTrending() {
  await getToken();
  const url =
    "https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks?limit=10";

  const result = await fetch(url, {
    headers: { Authorization: "Bearer " + token },
  });
  const data = await result.json();

  const container = document.querySelector(".trend-song");
  container.innerHTML = "";

  data.items.forEach((item) => {
    const track = item.track;
    const div = document.createElement("div");
    div.classList.add("trend1");
    div.innerHTML = `
      <img id="trend-img" src="${track.album.images[0]?.url}" alt="Album">
      <h3>${track.artists.map((a) => a.name).join(", ")} <br> ${track.name}</h3>
    `;
    container.appendChild(div);
  });
}

async function getArtists() {
  await getToken();
  const url =
    "https://api.spotify.com/v1/browse/new-releases?limit=10";

  const result = await fetch(url, {
    headers: { Authorization: "Bearer " + token },
  });
  const data = await result.json();

  const container = document.querySelector(".artist-row");
  container.innerHTML = "";

  data.albums.items.forEach((album) => {
    const div = document.createElement("div");
    div.classList.add("artist1");
    div.innerHTML = `
      <img src="${album.images[0]?.url}" alt="Artist Image">
      <h3>${album.artists.map((a) => a.name).join(", ")}</h3>
    `;
    container.appendChild(div);
  });
}

async function searchTracks() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return;

  if (!token) await getToken();

  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
    query
  )}&type=track&limit=10`;

  const result = await fetch(url, {
    headers: { Authorization: "Bearer " + token },
  });
  const data = await result.json();

  const container = document.getElementById("results");
  container.innerHTML = "";

  data.tracks.items.forEach((track) => {
    const div = document.createElement("div");
    div.classList.add("track");
    div.innerHTML = `
      <img src="${track.album.images[0]?.url}" alt="Album Cover">
      <h4>${track.name}</h4>
      <p>${track.artists.map((a) => a.name).join(", ")}</p>
      ${
        track.preview_url
          ? `<audio controls src="${track.preview_url}"></audio>`
          : "<p>No preview available</p>"
      }
      <button onclick="window.open('${track.external_urls.spotify}', '_blank')">Play on Spotify</button>
    `;
    container.appendChild(div);
  });
}

document.getElementById("btn").addEventListener("click", searchTracks);
document
  .getElementById("searchInput")
  .addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchTracks();
  });

getTrending();
getArtists();
