// API URLS
const SEARCH_URL = "https://theaudiodb.com/api/v1/json/2/search.php?s=";
const ALBUM_URL = "https://theaudiodb.com/api/v1/json/2/searchalbum.php?s=";

document.querySelectorAll(".sidebar .row1").forEach(row => {
    row.addEventListener("click", () => {
        const artistName = row.querySelector("h3").textContent.trim();
        loadArtistProfile(artistName);
    });
});

async function loadArtistProfile(artistName) {
    try {
        const res = await fetch(SEARCH_URL + encodeURIComponent(artistName));
        const data = await res.json();

        if (!data.artists) {
            alert("Artist not found.");
            return;
        }

        const artist = data.artists[0];

        // UPDATE PAGE CONTENT
        document.getElementById("trend-h1").textContent = artist.strArtist;

        document.getElementById("artist-img").src =
            artist.strArtistThumb ||
            artist.strArtistFanart ||
            "images/default.jpg";

        document.querySelector(".artist-desc h4").textContent =
            artist.strBiographyEN || "No biography available.";

        // LOAD ALBUMS
        loadArtistAlbums(artistName);

    } catch (error) {
        console.log("Error loading artist", error);
    }
}


async function loadArtistAlbums(artistName) {
    try {
        const res = await fetch(ALBUM_URL + encodeURIComponent(artistName));
        const data = await res.json();

        const gallery = document.querySelector(".gallery");
        gallery.innerHTML = ""; // reset

        if (!data.album) {
            gallery.innerHTML = "<p>No albums found.</p>";
            return;
        }

        data.album.forEach(album => {
            const div = document.createElement("div");
            div.classList.add("gallery-item");
            div.style.marginBottom = "25px";

            div.innerHTML = `
                <img src="${album.strAlbumThumb || 'images/default.jpg'}" id="gallery-img">
                <h3>${album.strAlbum} (${album.intYearReleased || 'N/A'})</h3>
                <p>${album.strDescriptionEN || 'No description available.'}</p>
            `;

            gallery.appendChild(div);
        });

    } catch (error) {
        console.log("Error loading albums", error);
    }
}

document.getElementById("btn").addEventListener("click", () => {
    const search = document.getElementById("search").value.trim();
    if (search) loadArtistProfile(search);
});
