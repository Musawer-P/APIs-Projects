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
        <div class="img-container">
            <img src="${track.album.cover_medium}" alt="${track.title}">
        </div>
        <div class="info">
            <h3>${track.artist.name}<br>${track.title}</h3>
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
        <div class="circle">
            <img src="${artist.picture_medium}" alt="${artist.name}">
        </div>
        <h3>${artist.name}</h3>
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
        const data = await jsonp(`https://api.deezer.com/search?q=${encodeURIComponent(query)}`);
        const tracks = data.data || [];
        if (tracks.length === 0) {
            trendContainer.innerHTML = "<p>No tracks found.</p>";
            return;
        }
        trendContainer.innerHTML = "";
        tracks.slice(0, 8).forEach(track => {
            const div = document.createElement("div");
            div.classList.add("trend1");
            div.innerHTML = `
                <img src="${track.album.cover_medium}" alt="${track.title}">
                <h3>${track.artist.name} <br> ${track.title}</h3>
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

// --- POPUP ---
const popup = document.getElementById("popup-player");
const popupImg = document.getElementById("popup-img");
const popupTitle = document.getElementById("popup-title");
const popupArtist = document.getElementById("popup-artist");
const popupAudio = document.getElementById("popup-audio");
const closePopup = document.getElementById("close-popup");

function openPopup(track) {
    popupImg.src = track.album.cover_big;
    popupTitle.textContent = track.title;
    popupArtist.textContent = track.artist.name;
    popupAudio.src = track.preview;
    popup.style.display = "flex";
    popupAudio.play();
}

closePopup.onclick = () => {
    popup.style.display = "none";
    popupAudio.pause();
};

window.onclick = e => {
    if (e.target === popup) {
        popup.style.display = "none";
        popupAudio.pause();
    }
};
