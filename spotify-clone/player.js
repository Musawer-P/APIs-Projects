
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
