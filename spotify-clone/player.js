const video = document.getElementById("video");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const volumeUp = document.getElementById("volUp");
const volumeDown = document.getElementById("volDown");

let index = 0;
const videos = [
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
];

function load(i) {
  index = (i + videos.length) % videos.length;
  video.src = videos[index];
  video.play();
}

playBtn.onclick = () => (video.paused ? video.play() : video.pause());
nextBtn.onclick = () => load(index + 1);
prevBtn.onclick = () => load(index - 1);
volumeUp.onclick = () => (video.volume = Math.min(video.volume + 0.1, 1));
volumeDown.onclick = () => (video.volume = Math.max(video.volume - 0.1, 0));

video.onplay = () => (playBtn.textContent = "Pause");
video.onpause = () => (playBtn.textContent = "Play");

load(0);
