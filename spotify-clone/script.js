// Containers
const trendContainer = document.querySelector(".trend-song");
const artistContainer = document.querySelector(".artist-row");
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("btn");

// --- JSONP helper ---
function jsonp(url, callbackName) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const name = callbackName || "jsonpCallback";
    window[name] = function(data) {
      resolve(data);
      document.body.removeChild(script);
      delete window[name];
    };
    script.src = url + `&output=jsonp&callback=${name}`;
    script.onerror = () => reject("JSONP request failed");
    document.body.appendChild(script);
  });
}

// --- 1. Load trending songs ---
async function getTrending() {
  trendContainer.innerHTML = "<p>Loading trending songs...</p>";
  try {
    const data = await jsonp("https://api.deezer.com/chart/0/tracks");
    const tracks = data.data || [];

    trendContainer.innerHTML = "";

    tracks.slice(0, 8).forEach(track => {
      const div = document.createElement("div");
      div.classList.add("trend1");
      div.innerHTML = `
        <img id="trend-img" src="${track.album.cover_medium}" alt="Album Cover">
        <h3>${track.artist.name} <br> ${track.title}</h3>
      `;
      trendContainer.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    trendContainer.innerHTML = "<p>Failed to load trending songs.</p>";
  }
}

// --- 2. Load top artists ---
async function getArtists() {
  artistContainer.innerHTML = "<p>Loading artists...</p>";
  try {
    const data = await jsonp("https://api.deezer.com/chart/0/artists");
    const artists = data.data || [];

    artistContainer.innerHTML = "";

    artists.slice(0, 8).forEach(artist => {
      const div = document.createElement("div");
      div.classList.add("artist1");
      div.innerHTML = `
        <img src="${artist.picture_medium}" alt="Artist Image">
        <h3>${artist.name}</h3>
      `;
      artistContainer.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    artistContainer.innerHTML = "<p>Failed to load artists.</p>";
  }
}

// --- 3. Search tracks by keyword ---
async function searchTracks() {
  const query = searchInput.value.trim();
  if (!query) return;

  trendContainer.innerHTML = "<p>Searching...</p>";
  try {
    const data = await jsonp(`https://api.deezer.com/search?q=${encodeURIComponent(query)}`);
    const tracks = data.data || [];

    trendContainer.innerHTML = "";

    if (tracks.length === 0) {
      trendContainer.innerHTML = "<p>No tracks found.</p>";
      return;
    }

    tracks.slice(0, 8).forEach(track => {
      const div = document.createElement("div");
      div.classList.add("trend1");
      div.innerHTML = `
        <img id="trend-img" src="${track.album.cover_medium}" alt="Album Cover">
        <h3>${track.artist.name} <br> ${track.title}</h3>
      `;
      trendContainer.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    trendContainer.innerHTML = "<p>Error searching tracks.</p>";
  }
}

// Event listeners
searchBtn.addEventListener("click", searchTracks);
searchInput.addEventListener("keypress", e => {
  if (e.key === "Enter") searchTracks();
});

// Load initial data
getTrending();
getArtists();
