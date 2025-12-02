const video = document.getElementById("video");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const volumeUp = document.getElementById("volUp");
const volumeDown = document.getElementById("volDown");

let index = 0;

const playlist = [
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
];

// Load video by index
function loadVideo(i) {
  index = (i + playlist.length) % playlist.length;
  video.src = playlist[index];
  video.play();
}

// Toggle play/pause
function togglePlay() {
  video.paused ? video.play() : video.pause();
}

// Next / Previous
function nextVideo() {
  loadVideo(index + 1);
}

function prevVideo() {
  loadVideo(index - 1);
}

// Volume controls with safe limit
function increaseVolume() {
  video.volume = Math.min(video.volume + 0.1, 1);
}

function decreaseVolume() {
  video.volume = Math.max(video.volume - 0.1, 0);
}

// Update play button label
video.onplay = () => (playBtn.textContent = "Pause");
video.onpause = () => (playBtn.textContent = "Play");

// Auto-play next video when finished
video.onended = nextVideo;

// Button events
playBtn.onclick = togglePlay;
nextBtn.onclick = nextVideo;
prevBtn.onclick = prevVideo;
volumeUp.onclick = increaseVolume;
volumeDown.onclick = decreaseVolume;

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case " ":
      e.preventDefault();
      togglePlay();
      break;
    case "ArrowRight":
      nextVideo();
      break;
    case "ArrowLeft":
      prevVideo();
      break;
    case "ArrowUp":
      increaseVolume();
      break;
    case "ArrowDown":
      decreaseVolume();
      break;
  }
});

// Load first video
loadVideo(0);
