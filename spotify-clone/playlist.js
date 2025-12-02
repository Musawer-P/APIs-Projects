const API = "https://theaudiodb.com/api/v1/json/2/search.php?s=";

const artistNames = ["eminem", "ariana grande", "coldplay", "rihanna", "avicii"];

const container = document.getElementById("artists");

async function loadArtists() {
  container.innerHTML = "Loading...";

  let cards = "";

  for (let name of artistNames) {
    const res = await fetch(API + encodeURIComponent(name));
    const data = await res.json();

    if (!data.artists) continue;

    const a = data.artists[0];
    cards += `
      <div class="artist-card" onclick="openArtist(${a.idArtist})">
        <img src="${a.strArtistThumb}" alt="${a.strArtist}">
        <h3>${a.strArtist}</h3>
      </div>
    `;
  }

  container.innerHTML = cards;
}

function openArtist(id) {
  // save ID in localStorage
  localStorage.setItem("artistId", id);
  window.location.href = "artist.html";
}

loadArtists();
