document.addEventListener("DOMContentLoaded", () => {
    const playlistContainer = document.querySelector(".sidebar-container");

    let playlist = JSON.parse(localStorage.getItem("playlist")) || [];

    function renderPlaylist() {
        playlistContainer.innerHTML = '<h1 id="playlist-h1">Playlist</h1>';

        playlist.forEach((song, index) => {
            const div = document.createElement("div");
            div.classList.add("sidebar");

            div.innerHTML = `
                <div class="container">
                    <div class="row1">
                        <img src="${song.cover}" id="artist-profile" alt="Song Image">
                        <div class="row2">
                            <h3 id="artist-name">${song.artist}</h3>
                            <h3 id="art-name">${song.title}</h3>
                        </div>
                        <button class="delete-btn" title="Remove">✖</button>
                    </div>
                </div>
            `;

            const deleteBtn = div.querySelector(".delete-btn");
            if (deleteBtn) {
                deleteBtn.addEventListener("click", () => {
                    deleteSongFromPlaylist(index);
                });
            }

            playlistContainer.appendChild(div);
        });
    }

    function addSongToPlaylist(song) {
        playlist = playlist.filter(s => s.title !== song.title || s.artist !== song.artist);
        playlist.unshift(song);
        localStorage.setItem("playlist", JSON.stringify(playlist));
        renderPlaylist();
    }

    function deleteSongFromPlaylist(index) {
        playlist.splice(index, 1);
        localStorage.setItem("playlist", JSON.stringify(playlist));
        renderPlaylist();
    }

    renderPlaylist();

    // Expose globally so other scripts can call it
    window.addSongToPlaylist = addSongToPlaylist;
});
