const API_BASE = 'https://api.spacexdata.com/v4';

const nextTitle = document.getElementById('nextTitle');
const nextDetails = document.getElementById('nextDetails');
const countdownEl = document.getElementById('countdown');
const upcomingList = document.getElementById('upcomingList');
const latestCard = document.getElementById('latestCard');

// Enhanced Upcoming Launches with Show More / Show Less
(async () => {
  const upcomingContainer = document.getElementById('upcoming-launches');
  const toggleBtn = document.getElementById('toggle-upcoming'); // create this button in HTML
  let allUpcoming = [];
  let limited = true;
  const LIMIT = 5;

  async function fetchUpcomingLaunches() {
    const res = await fetch('https://api.spacexdata.com/v4/launches/upcoming');
    const data = await res.json();
    data.sort((a,b) => new Date(a.date_utc) - new Date(b.date_utc));
    return data;
  }

  async function hydrateLaunch(launch) {
    const [rocket, pad] = await Promise.all([
      fetch(`${API_BASE}/rockets/${launch.rocket}`).then(r=>r.json()),
      fetch(`${API_BASE}/launchpads/${launch.launchpad}`).then(r=>r.json())
    ]);

    let orbit = '—';
    if (launch.payloads?.length) {
      try {
        const p = await fetch(`${API_BASE}/payloads/${launch.payloads[0]}`).then(r=>r.json());
        orbit = p.orbit || '—';
      } catch {}
    }

    return { launch, rocket, pad, orbit };
  }

  function makeCard({ launch, rocket, pad, orbit }) {
    return `
      <div class="cards-row">
        <div class="cards">
          <div class="first-card">
            <div class="status">
              <p class="p1">${escapeHtml(launch.name)}</p>
              <button type="button" class="waiting">Waiting</button>
            </div>
            <div class="row1">
              <p class="p2">Rocket: ${escapeHtml(rocket.name)}</p>
              <p class="p2">Launchpad: ${escapeHtml(pad.name)}</p>
            </div>
            <div class="row1" id = "row1-center">
              <p class="p3">${new Date(launch.date_utc).toLocaleString()}</p>
              <p class="p3">Orbit: ${escapeHtml(orbit)}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderUpcoming() {
    if (!upcomingContainer) return;
    const toShow = limited ? allUpcoming.slice(0, LIMIT) : allUpcoming;
    upcomingContainer.innerHTML = toShow.map(makeCard).join('');
    toggleBtn.style.display = allUpcoming.length > LIMIT ? 'inline-block' : 'none';
    toggleBtn.textContent = limited ? 'Show More' : 'Show Less';

    // Optional: attach "View Details" handlers
    attachViewDetailsHandlers();
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      limited = !limited;
      renderUpcoming();
    });
  }

  const launches = await fetchUpcomingLaunches();
  allUpcoming = await Promise.all(launches.map(hydrateLaunch));
  renderUpcoming();
})();


// Enhanced Past Launches with Show More / Show Less
(async () => {
  const pastContainer = document.getElementById('past-launches');
  const toggleBtn = document.getElementById('toggle-past');

  let allPast = [];
  let limited = true;
  const LIMIT = 5;

  async function fetchPastLaunches() {
    const res = await fetch('https://api.spacexdata.com/v4/launches/past');
    const data = await res.json();
    data.sort((a, b) => new Date(b.date_utc) - new Date(a.date_utc)); // latest first
    return data;
  }

  async function hydrateLaunch(launch) {
    const [rocket, pad] = await Promise.all([
      fetch(`${API_BASE}/rockets/${launch.rocket}`).then(r => r.json()),
      fetch(`${API_BASE}/launchpads/${launch.launchpad}`).then(r => r.json())
    ]);

    let orbit = '—';
    if (launch.payloads?.length) {
      try {
        const p = await fetch(`${API_BASE}/payloads/${launch.payloads[0]}`).then(r => r.json());
        orbit = p.orbit || '—';
      } catch {}
    }

    return { launch, rocket, pad, orbit };
  }

  function makeCard({ launch, rocket, pad, orbit }) {
    
    return `
      <div class="cards-row">
        <div class="cards">
          <div class="first-card">
            <div class="status">
              <p class="p1">${escapeHtml(launch.name)}</p>
              <button type="button" class="completed">
                ${launch.success ? 'Success' : 'Failed'}
              </button>
            </div>

            <div class="row1">
              <p class="p2">Rocket: ${escapeHtml(rocket.name)}</p>
              <p class="p2">Launchpad: ${escapeHtml(pad.name)}</p>
            </div>

            <div class="row1" id="row1-center">
              <p class="p3">${new Date(launch.date_utc).toLocaleString()}</p>
              <p class="p3">Orbit: ${escapeHtml(orbit)}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderPast() {
    if (!pastContainer) return;

    const toShow = limited ? allPast.slice(0, LIMIT) : allPast;
    pastContainer.innerHTML = toShow.map(makeCard).join('');

    toggleBtn.style.display = allPast.length > LIMIT ? 'inline-block' : 'none';
    toggleBtn.textContent = limited ? 'Show More' : 'Show Less';
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      limited = !limited;
      renderPast();
    });
  }

  const launches = await fetchPastLaunches();
  allPast = await Promise.all(launches.map(hydrateLaunch));
  renderPast();
})();






async function getLaunchpads() {
  const res = await fetch(`${API_BASE}/launchpads`);
  const data = await res.json();
  const map = {};
  data.forEach(lp => map[lp.id] = lp.name);
  return map;
}

async function getRockets() {
  const res = await fetch(`${API_BASE}/rockets`);
  const data = await res.json();
  const map = {};
  data.forEach(r => map[r.id] = r.name);
  return map;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function loadLaunchData() {
  try {
    const [rocketMap, launchpadMap] = await Promise.all([getRockets(), getLaunchpads()]);

    const [upcomingRes, pastRes] = await Promise.all([
      fetch(`${API_BASE}/launches/upcoming`),
      fetch(`${API_BASE}/launches/past`)
    ]);

    const upcoming = await upcomingRes.json();
    const past = await pastRes.json();

    // Sort
    upcoming.sort((a, b) => new Date(a.date_utc) - new Date(b.date_utc));
    past.sort((a, b) => new Date(b.date_utc) - new Date(a.date_utc));

    const upcomingContainer = document.querySelector("#upcoming-launches .cards-row");
    if (upcomingContainer) {
      upcomingContainer.innerHTML = upcoming.map(launch =>
        makeCard(
          launch,
          rocketMap[launch.rocket] || "Unknown",
          launchpadMap[launch.launchpad] || "Unknown",
          true
        )
      ).join("");
    }

    // Render past launches
    const pastContainer = document.querySelector("#past-launches .cards-row");
    if (pastContainer) {
      pastContainer.innerHTML = past.map(launch =>
        makeCard(
          launch,
          rocketMap[launch.rocket] || "Unknown",
          launchpadMap[launch.launchpad] || "Unknown",
          false
        )
      ).join("");
    }

    initUpcomingShowMore();

        attachViewDetailsHandlers();

    return { upcoming, past };
  } catch (err) {
    console.error("Error loading launch data:", err);
  }
}

// attach handlers to "View Details" buttons (optional hook - safe no-op if you have no special behavior)
function attachViewDetailsHandlers() {
  const detailButtons = document.querySelectorAll("#upcoming-launches .upcoming-details, #past-launches .upcoming-details");
  detailButtons.forEach(btn => {
    btn.onclick = () => {
          };
  });
}

function prettyDate(utcString){
  const d = new Date(utcString);
  return d.toLocaleString(); // local timezone
}

// Countdown helper (returns {d,h,m,s})
function getCountdownParts(targetDate){
  const now = Date.now();
  const diff = new Date(targetDate).getTime() - now;
  if (diff <= 0) return null;
  const s = Math.floor(diff / 1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  return {days, hours, mins, secs};
}

// Render countdown to the DOM
let countdownInterval = null;
function startCountdown(utcString){
  if (countdownInterval) clearInterval(countdownInterval);
  function tick(){
    const parts = getCountdownParts(utcString);
    if (!parts) {
      if (countdownEl) countdownEl.textContent = 'Launched / In progress';
      clearInterval(countdownInterval);
      return;
    }
    const pad = n => String(n).padStart(2,'0');
    if (countdownEl) countdownEl.textContent = `${parts.days}d ${pad(parts.hours)}:${pad(parts.mins)}:${pad(parts.secs)}`;
  }
  tick();
  countdownInterval = setInterval(tick, 1000);
}

// Load next launch summary (keeps your existing logic)
async function loadNextLaunch(){
  try{
    const res = await fetch(`${API_BASE}/launches/upcoming`);
    if (!res.ok) throw new Error('Failed to fetch upcoming launches');
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      if (nextTitle) nextTitle.textContent = 'No upcoming launches found';
      if (countdownEl) countdownEl.textContent = '--:--:--:--';
      return;
    }

    // Sort by date_utc ascending to find the earliest upcoming
    data.sort((a,b) => new Date(a.date_utc) - new Date(b.date_utc));
    const next = data[0];

    if (nextTitle) nextTitle.textContent = `${next.name} (${next.flight_number ?? 'N/A'})`;
    if (nextDetails) nextDetails.textContent = `Launch date: ${prettyDate(next.date_utc)} • Launchpad: ${next.launchpad ?? 'unknown'}`;
    if (next && next.date_utc) startCountdown(next.date_utc);

    renderUpcomingList(data.slice(0,6));
  } catch(err){
    console.error(err);
    if (nextTitle) nextTitle.textContent = 'Error loading next launch';
    if (nextDetails) nextDetails.textContent = '';
    if (countdownEl) countdownEl.textContent = '--:--:--:--';
  }
}

function renderUpcomingList(list){
  if (!upcomingList) return;
  if (!Array.isArray(list) || list.length === 0){
    upcomingList.innerHTML = '<div class="muted">No upcoming launches.</div>';
    return;
  }
  upcomingList.innerHTML = '';
  list.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'launch-item';
    const left = document.createElement('div');
    left.innerHTML = `<div><strong>${escapeHtml(item.name)}</strong></div><div class="small muted">Date: ${prettyDate(item.date_utc)}</div>`;
    const right = document.createElement('div');
    right.className = 'muted';
    right.textContent = item.upcoming ? 'Upcoming' : 'TBD';
    itemEl.appendChild(left);
    itemEl.appendChild(right);
    upcomingList.appendChild(itemEl);
  });
}

// Load latest launch (same as your logic)
async function loadLatestLaunch(){
  try{
    const res = await fetch(`${API_BASE}/launches/latest`);
    if (!res.ok) throw new Error('Failed to fetch latest launch');
    const latest = await res.json();
    if (latestCard) latestCard.innerHTML = `<div><strong>${escapeHtml(latest.name)}</strong></div>
                                <div class="small muted">Date: ${prettyDate(latest.date_utc)}</div>
                                <div class="small">Success: ${latest.success === true ? 'Yes' : (latest.success === false ? 'No' : 'Unknown')}</div>`;
  }catch(err){
    console.error(err);
    if (latestCard) latestCard.innerHTML = '<div class="error">Could not load latest launch.</div>';
  }
}

// Initialize auto-refresh for next/latest
(function initAutoRefresh(){
  loadNextLaunch();
  loadLatestLaunch();
  setInterval(()=>{ loadNextLaunch(); loadLatestLaunch(); }, 60_000);
})();


const modal = document.getElementById("Modal");
const modal2 = document.getElementById("Modal2");
const modal3 = document.getElementById("Modal3");
const modal4 = document.getElementById("Modal4");

const openModalBtn1 = document.getElementById("openModal");
const openModalBtn2 = document.getElementById("openModal2");
const openModalBtn3 = document.getElementById("openModal3");
const openModalBtn4 = document.getElementById("openModal4");

const closeBtn = document.querySelector(".close");
const closeBtn2 = document.querySelector(".close2");
const closeBtn3 = document.querySelector(".close3");
const closeBtn4 = document.querySelector(".close4");

// Safe attach open/close handlers (guard for null)
if (openModalBtn1 && modal) openModalBtn1.onclick = () => modal.style.display = "block";
if (openModalBtn2 && modal2) openModalBtn2.onclick = () => modal2.style.display = "block";
if (openModalBtn3 && modal3) openModalBtn3.onclick = () => modal3.style.display = "block";
if (openModalBtn4 && modal4) openModalBtn4.onclick = () => modal4.style.display = "block";

if (closeBtn && modal) closeBtn.onclick = () => modal.style.display = "none";
if (closeBtn2 && modal2) closeBtn2.onclick = () => modal2.style.display = "none";
if (closeBtn3 && modal3) closeBtn3.onclick = () => modal3.style.display = "none";
if (closeBtn4 && modal4) closeBtn4.onclick = () => modal4.style.display = "none";

// Image viewers
const images = document.querySelectorAll(".image-gallery img");
const images2 = document.querySelectorAll(".image-gallery2 img");
const images3 = document.querySelectorAll(".image-gallery3 img");
const images4 = document.querySelectorAll(".image-gallery4 img");

const imgViewer = document.getElementById("imgViewer");
const imgViewer2 = document.getElementById("imgViewer2");
const imgViewer3 = document.getElementById("imgViewer3");
const imgViewer4 = document.getElementById("imgViewer4");

const viewerImg = document.getElementById("viewerImg");
const viewerImg2 = document.getElementById("viewerImg2");
const viewerImg3 = document.getElementById("viewerImg3");
const viewerImg4 = document.getElementById("viewerImg4");

const closeImg = document.getElementById("closeImg");
const closeImg2 = document.getElementById("closeImg2");
const closeImg3 = document.getElementById("closeImg3");
const closeImg4 = document.getElementById("closeImg4");

// Safe add listeners for gallery images
if (images && viewerImg && imgViewer) {
  images.forEach(img => img.addEventListener("click", () => {
    viewerImg.src = img.src;
    imgViewer.style.display = "flex";
  }));
}
if (images2 && viewerImg2 && imgViewer2) {
  images2.forEach(img => img.addEventListener("click", () => {
    viewerImg2.src = img.src;
    imgViewer2.style.display = "flex";
  }));
}
if (images3 && viewerImg3 && imgViewer3) {
  images3.forEach(img => img.addEventListener("click", () => {
    viewerImg3.src = img.src;
    imgViewer3.style.display = "flex";
  }));
}
if (images4 && viewerImg4 && imgViewer4) {
  images4.forEach(img => img.addEventListener("click", () => {
    viewerImg4.src = img.src;
    imgViewer4.style.display = "flex";
  }));
}

// Close viewer buttons
if (closeImg && imgViewer) closeImg.onclick = () => imgViewer.style.display = "none";
if (closeImg2 && imgViewer2) closeImg2.onclick = () => imgViewer2.style.display = "none";
if (closeImg3 && imgViewer3) closeImg3.onclick = () => imgViewer3.style.display = "none";
if (closeImg4 && imgViewer4) closeImg4.onclick = () => imgViewer4.style.display = "none";

const Missionmodal = document.getElementById("MissionModal");
const Missionmodal2 = document.getElementById("MissionModal2");
const Missionmodal3 = document.getElementById("MissionModal3");
const Missionmodal4 = document.getElementById("MissionModal4");

const Missionbtn = document.getElementById("mission-btn-modal");
const Missionbtn2 = document.getElementById("mission-btn-modal2");
const Missionbtn3 = document.getElementById("mission-btn-modal3");
const Missionbtn4 = document.getElementById("mission-btn-modal4");

const MissioncloseBtn = document.querySelector(".Missionclose");
const MissioncloseBtn2 = document.querySelector(".Missionclose2");
const MissioncloseBtn3 = document.querySelector(".Missionclose3");
const MissioncloseBtn4 = document.querySelector(".Missionclose4");

// mission image viewers
const Missionimages = document.querySelectorAll(".Missionimage-gallery img");
const Missionimages2 = document.querySelectorAll(".Missionimage-gallery2 img");
const Missionimages3 = document.querySelectorAll(".Missionimage-gallery3 img");
const Missionimages4 = document.querySelectorAll(".Missionimage-gallery4 img");

const MissionimgViewer = document.getElementById("MissionimgViewer");
const MissionimgViewer2 = document.getElementById("MissionimgViewer2");
const MissionimgViewer3 = document.getElementById("MissionimgViewer3");
const MissionimgViewer4 = document.getElementById("MissionimgViewer4");

const MissionviewerImg = document.getElementById("MissionviewerImg");
const MissionviewerImg2 = document.getElementById("MissionviewerImg2");
const MissionviewerImg3 = document.getElementById("MissionviewerImg3");
const MissionviewerImg4 = document.getElementById("MissionviewerImg4");

const MissioncloseImg = document.getElementById("MissioncloseImg");
const MissioncloseImg2 = document.getElementById("MissioncloseImg2");
const MissioncloseImg3 = document.getElementById("MissioncloseImg3");
const MissioncloseImg4 = document.getElementById("MissioncloseImg4");

// Safe attach mission open/close handlers
if (Missionbtn && Missionmodal) Missionbtn.onclick = () => Missionmodal.style.display = "block";
if (Missionbtn2 && Missionmodal2) Missionbtn2.onclick = () => Missionmodal2.style.display = "block";
if (Missionbtn3 && Missionmodal3) Missionbtn3.onclick = () => Missionmodal3.style.display = "block";
if (Missionbtn4 && Missionmodal4) Missionbtn4.onclick = () => Missionmodal4.style.display = "block";

if (MissioncloseBtn && Missionmodal) MissioncloseBtn.onclick = () => Missionmodal.style.display = "none";
if (MissioncloseBtn2 && Missionmodal2) MissioncloseBtn2.onclick = () => Missionmodal2.style.display = "none";
if (MissioncloseBtn3 && Missionmodal3) MissioncloseBtn3.onclick = () => Missionmodal3.style.display = "none";
if (MissioncloseBtn4 && Missionmodal4) MissioncloseBtn4.onclick = () => Missionmodal4.style.display = "none";

// Mission image viewer handlers
if (Missionimages && MissionviewerImg && MissionimgViewer) {
  Missionimages.forEach(img => img.addEventListener("click", () => {
    MissionviewerImg.src = img.src;
    MissionimgViewer.style.display = "flex";
  }));
}
if (Missionimages2 && MissionviewerImg2 && MissionimgViewer2) {
  Missionimages2.forEach(img => img.addEventListener("click", () => {
    MissionviewerImg2.src = img.src;
    MissionimgViewer2.style.display = "flex";
  }));
}
if (Missionimages3 && MissionviewerImg3 && MissionimgViewer3) {
  Missionimages3.forEach(img => img.addEventListener("click", () => {
    MissionviewerImg3.src = img.src;
    MissionimgViewer3.style.display = "flex";
  }));
}
if (Missionimages4 && MissionviewerImg4 && MissionimgViewer4) {
  Missionimages4.forEach(img => img.addEventListener("click", () => {
    MissionviewerImg4.src = img.src;
    MissionimgViewer4.style.display = "flex";
  }));
}

if (MissioncloseImg && MissionimgViewer) MissioncloseImg.onclick = () => MissionimgViewer.style.display = "none";
if (MissioncloseImg2 && MissionimgViewer2) MissioncloseImg2.onclick = () => MissionimgViewer2.style.display = "none";
if (MissioncloseImg3 && MissionimgViewer3) MissioncloseImg3.onclick = () => MissionimgViewer3.style.display = "none";
if (MissioncloseImg4 && MissionimgViewer4) MissioncloseImg4.onclick = () => MissionimgViewer4.style.display = "none";

window.addEventListener("click", (event) => {
  const allModals = [
    modal, modal2, modal3, modal4,
    imgViewer, imgViewer2, imgViewer3, imgViewer4,
    Missionmodal, Missionmodal2, Missionmodal3, Missionmodal4,
    MissionimgViewer, MissionimgViewer2, MissionimgViewer3, MissionimgViewer4
  ].filter(Boolean);

  allModals.forEach(m => {
    if (event.target === m) m.style.display = "none";
  });
});



(async () => {
  const searchInput = document.getElementById('search');
  const searchButton = document.getElementById('btn');
  const prevButton = document.getElementById('prev');
  const nextButton = document.getElementById('next');
  const closeButton = document.getElementById('close');
  const searchResults = document.getElementById('search-results');
  const searchCount = document.getElementById('search-count');

  let allLaunches = [];
  let matches = [];
  let currentIndex = 0;

  // Fetch launches
  async function fetchLaunches() {
    const [upcoming, past] = await Promise.all([
      fetch('https://api.spacexdata.com/v4/launches/upcoming').then(r=>r.json()),
      fetch('https://api.spacexdata.com/v4/launches/past').then(r=>r.json())
    ]);

    upcoming.sort((a,b)=> new Date(a.date_utc)-new Date(b.date_utc));
    past.sort((a,b)=> new Date(b.date_utc)-new Date(a.date_utc));
    const recentPast = past.slice(0,20);

    return [...upcoming, ...recentPast];
  }

  async function hydrateLaunch(launch) {
    const [rocket, pad] = await Promise.all([
      fetch(`https://api.spacexdata.com/v4/rockets/${launch.rocket}`).then(r=>r.json()),
      fetch(`https://api.spacexdata.com/v4/launchpads/${launch.launchpad}`).then(r=>r.json())
    ]);

    let orbit = '—';
    if (launch.payloads && launch.payloads.length) {
      try {
        const p = await fetch(`https://api.spacexdata.com/v4/payloads/${launch.payloads[0]}`).then(r=>r.json());
        orbit = p.orbit || '—';
      } catch(e) {}
    }

    return { launch, rocket, pad, orbit };
  }

  // Render results
  function renderResults(launches) {
    searchResults.innerHTML = '';
    if (launches.length === 0) {
      searchResults.innerHTML = '<p>No launches found</p>';
      searchCount.textContent = '';
      return;
    }

    launches.forEach(({ launch, rocket, pad, orbit }) => {
      const div = document.createElement('div');
      div.classList.add('launch-card');
      div.innerHTML = `
        <h3>${launch.name}</h3>
        <p>Rocket: ${rocket.name}</p>
        <p>Launchpad: ${pad.name}</p>
        <p>Date: ${new Date(launch.date_utc).toLocaleString()}</p>
        <p>Orbit: ${orbit}</p>
      `;
      searchResults.appendChild(div);
    });

    currentIndex = 0;
    updateHighlight();
  }

  // ===== Search =====
  function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) return;

    matches = allLaunches.filter(({ launch, rocket, pad }) =>
      launch.name.toLowerCase().includes(query) ||
      rocket.name.toLowerCase().includes(query) ||
      pad.name.toLowerCase().includes(query)
    );

    renderResults(matches);

    // Show Prev/Next/Close buttons
    prevButton.style.display = 'inline-block';
    nextButton.style.display = 'inline-block';
    closeButton.style.display = 'inline-block';
  }

  // Highlight current match 
  function updateHighlight() {
    if (matches.length === 0) {
      searchCount.textContent = '';
      return;
    }

    const cards = document.querySelectorAll('.launch-card');
    cards.forEach(card => card.style.border = 'none');

    const currentCard = cards[currentIndex];
    if (currentCard) {
      currentCard.style.border = '2px solid white';
      currentCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      searchCount.textContent = `${currentIndex + 1}/${matches.length}`;
    }
  }

  function nextMatch() {
    if (matches.length === 0) return;
    currentIndex = (currentIndex + 1) % matches.length;
    updateHighlight();
  }

  function prevMatch() {
    if (matches.length === 0) return;
    currentIndex = (currentIndex - 1 + matches.length) % matches.length;
    updateHighlight();
  }

  // ===== Close search =====
  function closeSearch() {
    searchInput.value = '';
    searchResults.innerHTML = '';
    searchCount.textContent = '';
    matches = [];
    currentIndex = 0;

    // Hide Prev/Next/Close buttons
    prevButton.style.display = 'none';
    nextButton.style.display = 'none';
    closeButton.style.display = 'none';
  }

  // Event listeners
  searchButton.addEventListener('click', performSearch);
  nextButton.addEventListener('click', nextMatch);
  prevButton.addEventListener('click', prevMatch);
  closeButton.addEventListener('click', closeSearch);

  // ===== Initialize =====
  const launches = await fetchLaunches();
  allLaunches = await Promise.all(launches.map(hydrateLaunch));

})();




window.addEventListener('DOMContentLoaded', async () => {
  // load main card lists
  await loadLaunchData();

 
  loadNextLaunch();
  loadLatestLaunch();
});



