 // Project URLs
const projectPaths = {
  view1: "https://anime-and-manga-explorer-mp.netlify.app/",
  view2: "https://spacex-launch-tracker-mp.netlify.app/",
  view3: "https://frabjous-horse-2113cc.netlify.app/",
  view4: "https://lucent-chimera-7311b7.netlify.app/",
  view5: "https://spotify-clone-mp.netlify.app/",
  view6: "https://crypto-price-tracker-mp.netlify.app/",
  view7: "https://personal-health-mp.netlify.app/",
  view8: "https://movie-nest-mp.netlify.app/",
  view9: "https://recipes-finder-mp.netlify.app/",
  view10: "https://bus-tracker-mp.netlify.app/",
  view11: "https://flight-tracker-mp.netlify.app/",
  view12: "https://global-disaster-mp.netlify.app/",
  view13: "https://book-search-mp.netlify.app/",
  view14: "https://personal-health-mp.netlify.app/",
  view15: "https://country-explorer-mp.netlify.app/",
  view16: "https://game-recommendation-mp.netlify.app/",
  view17: "https://github-user-explorer-me.netlify.app/",
  view18: "https://boredbot",
  view19: "https://blogapi"
};

// Attach click events dynamically
Object.keys(projectPaths).forEach(id => {
  const element = document.getElementById(id);
  if (element) {
    element.addEventListener("click", () => {
      window.open(projectPaths[id], "_blank");
    });
  }
});