// Containers
const trendContainer = document.querySelector(".trend-song");
const artistContainer = document.querySelector(".artist-row");
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("btn");

// JSONP helper
function jsonp(url) {
    return new Promise((resolve, reject) => {
        const callbackName = "jsonp_cb_" + Math.round(Math.random() * 999999);
        window[callbackName] = function (data) {
            resolve(data);
            delete window[callbackName];
            document.body.removeChild(script);
        };
        const script = document.createElement("script");
        script.src = `${url}${url.includes("?") ? "&" : "?"}output=jsonp&callback=${callbackName}`;
        script.onerror = () => reject("JSONP request failed");
        document.body.appendChild(script);
    });
}

// --- Trending songs ---
async function getTrending() {
    trendContainer.innerHTML = "<p>Loading trending songs...</p>";

    try {
        const data = await jsonp("https://api.deezer.com/chart/0");
        const tracks = data.tracks.data;

        trendContainer.innerHTML = "";

tracks.slice(0, 8).forEach(track => {
    const div = document.createElement("div");
    div.classList.add("trend1");

    div.innerHTML = `
        <div class="trend-song">
        <div class = "trend1">
            <img id = "trend-img" src="${track.album.cover_medium}" alt="${track.title}">
            <h3 class = "trend-title">${track.artist.name}<br>${track.title}</h3>
        </div>
        
    `;

    div.addEventListener("click", () => {
        addSongToPlaylist({
            artist: track.artist.name,
            title: track.title,
            cover: track.album.cover_medium
        });
        openPopup(track);
    });

    trendContainer.appendChild(div);
});
    } catch (err) {
        console.error(err);
        trendContainer.innerHTML = "<p>Failed to load trending songs.</p>";
    }
}

// --- Artists ---
async function getArtists() {
    artistContainer.innerHTML = "";
    try {
        const data = await jsonp("https://api.deezer.com/chart/0/artists");
        const artists = data.data || [];
        artists.slice(0, 8).forEach(artist => {
    const div = document.createElement("div");
    div.classList.add("artist1");

    div.innerHTML = `
        <div class="artist-row">
        <div class = "artist1">
            <img id = "artist-img" src="${artist.picture_medium}" alt="${artist.name}">
            <h3>${artist.name}</h3>
        </div>
        </div>
    `;

    div.addEventListener("click", () => {
        window.location.href = `artist.html?id=${artist.id}`;
    });

    artistContainer.appendChild(div);
});

    } catch (err) {
        artistContainer.innerHTML = "<p>Failed to load artists.</p>";
    }
}

// --- Search music ---
async function searchTracks() {
    const query = searchInput.value.trim();
    if (!query) return;

    trendContainer.innerHTML = "<p>Searching...</p>";

    try {
       // --- Artist Search ---
const artistData = await jsonp(`https://api.deezer.com/search/artist?q=${encodeURIComponent(query)}`);
const artistResults = artistData.data || [];

if (artistResults.length > 0) {
    trendContainer.innerHTML = "<h2>Artists</h2>";
    artistResults.slice(0, 8).forEach(artist => {
        const div = document.createElement("div");
        div.classList.add("artist1");
        div.innerHTML = `
            <img src="${artist.picture_medium}" alt="${artist.name}">
            <h3>${artist.name}</h3>
        `;
        div.addEventListener("click", () => {
            window.location.href = `artist.html?id=${artist.id}`;
        });
        trendContainer.appendChild(div);
    });

    return;  // stop here so tracks do not override artist results
}

    } catch (err) {
        trendContainer.innerHTML = "<p>Error searching tracks.</p>";
    }
}

// Listeners
searchBtn.addEventListener("click", searchTracks);
searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") searchTracks();
});

// Load trending & artists
getTrending();
getArtists();
