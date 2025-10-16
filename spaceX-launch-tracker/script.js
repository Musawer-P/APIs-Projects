    const API_BASE = 'https://api.spacexdata.com/v4';

    const nextTitle = document.getElementById('nextTitle');
    const nextDetails = document.getElementById('nextDetails');
    const countdownEl = document.getElementById('countdown');
    const upcomingList = document.getElementById('upcomingList');
    const latestCard = document.getElementById('latestCard');

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
          countdownEl.textContent = 'Launched / In progress';
          clearInterval(countdownInterval);
          return;
        }
        const pad = n => String(n).padStart(2,'0');
        countdownEl.textContent = `${parts.days}d ${pad(parts.hours)}:${pad(parts.mins)}:${pad(parts.secs)}`;
      }
      tick();
      countdownInterval = setInterval(tick, 1000);
    }

    async function loadNextLaunch(){
      try{
        const res = await fetch(`${API_BASE}/launches/upcoming`);
        if (!res.ok) throw new Error('Failed to fetch upcoming launches');
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
          nextTitle.textContent = 'No upcoming launches found';
          countdownEl.textContent = '--:--:--:--';
          return;
        }

        // Sort by date_utc ascending to find the earliest upcoming
        data.sort((a,b) => new Date(a.date_utc) - new Date(b.date_utc));
        const next = data[0];

        nextTitle.textContent = `${next.name} (${next.flight_number ?? 'N/A'})`;
        nextDetails.textContent = `Launch date: ${prettyDate(next.date_utc)} • Launchpad: ${next.launchpad ?? 'unknown'}`;
        startCountdown(next.date_utc);

        renderUpcomingList(data.slice(0,6));
      } catch(err){
        console.error(err);
        nextTitle.textContent = 'Error loading next launch';
        nextDetails.textContent = '';
        countdownEl.textContent = '--:--:--:--';
      }
    }

    function renderUpcomingList(list){
      if (!Array.isArray(list) || list.length === 0){
        upcomingList.innerHTML = '<div class="muted">No upcoming launches.</div>';
        return;
      }
      upcomingList.innerHTML = '';
      list.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'launch-item';
        const left = document.createElement('div');
        left.innerHTML = `<div><strong>${item.name}</strong></div><div class="small muted">Date: ${prettyDate(item.date_utc)}</div>`;
        const right = document.createElement('div');
        right.className = 'muted';
        right.textContent = item.upcoming ? 'Upcoming' : 'TBD';
        itemEl.appendChild(left);
        itemEl.appendChild(right);
        upcomingList.appendChild(itemEl);
      });
    }

    // Load latest launch
    async function loadLatestLaunch(){
      try{
        const res = await fetch(`${API_BASE}/launches/latest`);
        if (!res.ok) throw new Error('Failed to fetch latest launch');
        const latest = await res.json();
        latestCard.innerHTML = `<div><strong>${latest.name}</strong></div>
                                <div class="small muted">Date: ${prettyDate(latest.date_utc)}</div>
                                <div class="small">Success: ${latest.success === true ? 'Yes' : (latest.success === false ? 'No' : 'Unknown')}</div>`;
      }catch(err){
        console.error(err);
        latestCard.innerHTML = '<div class="error">Could not load latest launch.</div>';
      }
    }

    // Initialize
    (function init(){
      loadNextLaunch();   
      loadLatestLaunch(); 
      setInterval(()=>{ loadNextLaunch(); loadLatestLaunch(); }, 60_000);
    })();

 

    const modal = document.getElementById("Modal");
    const modal2 = document.getElementById("Modal2");
    const modal3 = document.getElementById("Modal3");
    const modal4 = document.getElementById("Modal4");
    const btn = document.getElementById("openModal");
    const btn2 = document.getElementById("openModal2");
    const btn3 = document.getElementById("openModal3");
    const btn4 = document.getElementById("openModal4");
    const closeBtn = document.querySelector(".close");
    const closeBtn2 = document.querySelector(".close2");
    const closeBtn3 = document.querySelector(".close3");
    const closeBtn4 = document.querySelector(".close4");

    btn.onclick = () => {
      modal.style.display = "block";
      
    }
    btn2.onclick = () => {
      modal2.style.display = "block";
      
    } ;btn3.onclick = () => {
      modal3.style.display = "block";
      
    } ;btn4.onclick = () => {
      modal4.style.display = "block";
      
    }

    closeBtn.onclick = () => {
      modal.style.display = "none";
    }
  
    
    closeBtn2.onclick = () => {
      modal2.style.display = "none";
    }

    
    closeBtn3.onclick = () => {
      modal3.style.display = "none";
    }
    
    closeBtn4.onclick = () => {
      modal4.style.display = "none";
    }
    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    }

    window.onclick = (event) => {
      if (event.target === modal2) {
        modal2.style.display = "none";
      }
    }

    window.onclick = (event) => {
      if (event.target === modal3) {
        modal3.style.display = "none";
      }
    }

    window.onclick = (event) => {
      if (event.target === modal3) {
        modal3.style.display = "none";
      }
    }




    // Image enlarge logic
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


images.forEach(img => {
img.addEventListener("click", () => {
viewerImg.src = img.src;
imgViewer.style.display = "flex";
});
});



images2.forEach(img => {
  img.addEventListener("click", () => {
  viewerImg2.src = img.src;
  imgViewer2.style.display = "flex";
  });
  });

  
  
images3.forEach(img => {
  img.addEventListener("click", () => {
  viewerImg3.src = img.src;
  imgViewer3.style.display = "flex";
  });
  });

  
  
images4.forEach(img => {
  img.addEventListener("click", () => {
  viewerImg4.src = img.src;
  imgViewer4.style.display = "flex";
  });
  });
  
closeImg.onclick = () => imgViewer.style.display = "none";
window.onclick = (e) => {
if (e.target === imgViewer) imgViewer.style.display = "none";
};

 
closeImg2.onclick = () => imgViewer2.style.display = "none";
window.onclick = (e) => {
if (e.target === imgViewer2) imgViewer2.style.display = "none";
};

 
closeImg3.onclick = () => imgViewer3.style.display = "none";
window.onclick = (e) => {
if (e.target === imgViewer3) imgViewer3.style.display = "none";
};

 
closeImg4.onclick = () => imgViewer4.style.display = "none";
window.onclick = (e) => {
if (e.target === imgViewer4) imgViewer4.style.display = "none";
};
