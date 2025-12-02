const apiURL = "https://theaudiodb.com/api/v1/json/2/search.php?s=";

// Get artist name from URL
const params = new URLSearchParams(window.location.search);
const artistName = params.get("name");

// if no name, stop
if (!artistName) {
    document.body.innerHTML = "<h2>No artist selected.</h2>";
    throw new Error("Artist name missing");
}

// Load artist info
async function loadArtist(name) {
    const res = await fetch(apiURL + encodeURIComponent(name));
    const data = await res.json();

    if (!data.artists) {
        document.getElementById("artist-name").textContent = "Artist Not Found";
        return;
    }

    const a = data.artists[0];

    // Fill page with data
    document.getElementById("artist-name").textContent = a.strArtist;
    document.getElementById("artist-img").src =
        a.strArtistThumb || "images/default.jpg";
    document.getElementById("artist-bio").textContent =
        a.strBiographyEN || "No biography available.";
}

loadArtist(artistName);
