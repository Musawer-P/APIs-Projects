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

 