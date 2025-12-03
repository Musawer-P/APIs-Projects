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

// Get artist ID from URL:   artist.html?id=27
const params = new URLSearchParams(window.location.search);
const artistId = params.get("id");

// Page elements
const artistNameEl = document.getElementById("trend-h1");
const artistImgEl  = document.getElementById("artist-img");
const artistBioEl  = document.getElementById("artist-bio");
const albumsGallery = document.getElementById("albums-gallery");
const otherArtistsContainer = document.getElementById("other-artists");

// ---------- LOAD ARTIST DETAILS ----------
async function loadArtist() {
    const data = await jsonp(`https://api.deezer.com/artist/${artistId}`);

    artistNameEl.textContent = data.name;
    artistImgEl.src = data.picture_big;

    artistBioEl.innerHTML = `
        <strong>${data.name}</strong> has over <strong>${data.nb_fan.toLocaleString()}</strong> fans.
        Here are some of their top albums and music from Deezer.
    `;

    loadAlbums();
    loadSidebarArtists();
}

// ---------- LOAD ALBUMS ----------
async function loadAlbums() {
    const albums = await jsonp(`https://api.deezer.com/artist/${artistId}/albums`);

    albumsGallery.innerHTML = "";

    albums.data.slice(0, 4).forEach(album => {
        const div = document.createElement("div");
        div.classList.add("gallery-one");

        div.innerHTML = `
            <img src="${album.cover_medium}" id="gallery-img">
            <h3>${album.title}</h3>
            <p>Release date: ${album.release_date}</p>
        `;

        albumsGallery.appendChild(div);
    });
}

// ---------- SIDEBAR: SHOW OTHER ARTISTS ----------
async function loadSidebarArtists() {
    const chart = await jsonp("https://api.deezer.com/chart/0/artists");

    otherArtistsContainer.innerHTML = "";

    chart.data.slice(0, 5).forEach(artist => {
        const sidebarItem = document.createElement("div");
        sidebarItem.classList.add("sidebar");

        sidebarItem.innerHTML = `
            <div class="container">
                <div class="row1">
                    <img src="${artist.picture_medium}" id="artist-profile">
                    <div class="row2">
                        <h3 id="artist-name">${artist.name}</h3>
                    </div>
                </div>
            </div>
        `;

        sidebarItem.addEventListener("click", () => {
            window.location.href = `artist.html?id=${artist.id}`;
        });

        otherArtistsContainer.appendChild(sidebarItem);
    });
}

loadArtist();
