 const TM_API_KEY = "YOUR_TICKETMASTER_API_KEY"; // <- put your key here
    const TM_BASE = "https://app.ticketmaster.com/discovery/v2/events.json";

    // UI refs
    const el = id => document.getElementById(id);
    const list = el("list");
    const favList = el("favList");
    const favEmpty = el("favEmpty");
    const count = el("count");
    const total = el("total");
    const pageEl = el("page");
    const btnPrev = el("prev");
    const btnNext = el("next");
    const btnSearch = el("search");
    const btnSurprise = el("surprise");
    const btnShowFavs = el("showFavs");
    const btnCloseFavs = el("closeFavs");
    const favoritesPanel = el("favoritesPanel");
    const city = el("city");
    const country = el("country");
    const from = el("from");
    const to = el("to");
    const sort = el("sort");

    // State
    let page = 0; // Ticketmaster pages are 0-indexed
    let size = 24;
    let lastData = null;
    const favKey = "festival_favs_v1";
    const favs = new Set(JSON.parse(localStorage.getItem(favKey) || "[]"));
    const saveFavs = () => localStorage.setItem(favKey, JSON.stringify([...favs]));

    // Map
    let map, markers;
    function initMap() {
      map = L.map("map", { scrollWheelZoom: true }).setView([20, 0], 2);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors"
      }).addTo(map);
      markers = L.layerGroup().addTo(map);
    }

    function isoDateStr(d) {
      // to YYYY-MM-DDTHH:mm:ssZ (start of day / end of day)
      const pad = n => String(n).padStart(2,"0");
      return `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}T00:00:00Z`;
    }
    function isoEndDateStr(d) {
      const pad = n => String(n).padStart(2,"0");
      return `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}T23:59:59Z`;
    }

    function buildParams(randomize=false) {
      const params = new URLSearchParams();
      params.set("apikey", TM_API_KEY);
      params.set("size", size);
      params.set("page", page);
      // Classification: festivals / music / arts
      params.set("classificationName", "festival");
      // Optional location filters
      if (country.value.trim()) params.set("countryCode", country.value.trim().toUpperCase());
      if (city.value.trim()) params.set("city", city.value.trim());
      // Date range
      if (from.value) params.set("startDateTime", new Date(from.value + "T00:00:00Z").toISOString());
      if (to.value) params.set("endDateTime", new Date(to.value + "T23:59:59Z").toISOString());
      // Sort
      if (sort.value) params.set("sort", sort.value);
      if (randomize) {
        // Shuffle by jumping to a random page later (we'll do after fetching first page metadata)
      }
      return params;
    }

    async function fetchEvents(params) {
      const url = `${TM_BASE}?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load festivals");
      return res.json();
    }

    function eventToCoords(e) {
      const venue = e?._embedded?.venues?.[0];
      const loc = venue?.location;
      if (loc && loc.latitude && loc.longitude) return [parseFloat(loc.latitude), parseFloat(loc.longitude)];
      return null;
    }

    function renderList(data) {
      lastData = data;
      const pageInfo = data?.page || {};
      const events = data?._embedded?.events || [];
      total.textContent = pageInfo.totalElements ?? 0;
      count.textContent = events.length;
      pageEl.textContent = (pageInfo.number ?? 0) + 1;

      btnPrev.disabled = !(pageInfo.number > 0);
      btnNext.disabled = !((pageInfo.number + 1) < (pageInfo.totalPages || 0));

      // Clear
      list.innerHTML = "";
      markers.clearLayers();

      if (events.length === 0) {
        list.innerHTML = `<div class="empty">No festivals match your filters.</div>`;
        return;
      }

      // Fit map to results
      const bounds = [];
      events.forEach(e => {
        const coords = eventToCoords(e);
        if (coords) bounds.push(coords);
      });
      if (bounds.length) {
        try { map.fitBounds(bounds, { padding: [30,30] }); } catch(_) {}
      }

      // Render cards + markers
      events.forEach(e => {
        const name = e.name || "Untitled Festival";
        const url = e.url || "#";
        const dates = e.dates?.start;
        const start = dates?.localDate || dates?.dateTime || "";
        const endTBA = e.dates?.end?.localDate ? ` – ${e.dates.end.localDate}` : "";
        const venue = e?._embedded?.venues?.[0];
        const place = [venue?.name, venue?.city?.name, venue?.country?.name].filter(Boolean).join(", ");
        const img = (e.images||[]).sort((a,b)=>b.width-a.width)[0]?.url || "";
        const priceRanges = e.priceRanges?.[0];
        const price = priceRanges ? `${priceRanges.min}–${priceRanges.max} ${priceRanges.currency}` : "TBA";
        const id = e.id;

        // Card
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          ${img ? `<img class="cover" src="${img}" alt="">` : ""}
          <div class="pad">
            <div class="title">${name}</div>
            <div class="muted">${place || "Location TBA"}</div>
            <div class="badges">
              <span class="badge">${start || "Date TBA"}${endTBA}</span>
              <span class="badge">Price: ${price}</span>
            </div>
            <div class="actions">
              <a class="pill" href="${url}" target="_blank" rel="noopener">Open Details</a>
              <button class="fav ${favs.has(id) ? "active":""}" data-id="${id}">
                ${favs.has(id) ? "★ Favorited" : "☆ Add Favorite"}
              </button>
            </div>
          </div>
        `;
        list.appendChild(card);

        // Map marker
        const coords = eventToCoords(e);
        if (coords) {
          const marker = L.marker(coords).addTo(markers);
          marker.bindPopup(`<b>${name}</b><br>${place || ""}<br><a href="${url}" target="_blank" rel="noopener">Open</a>`);
        }
      });

      // Fav buttons
      list.querySelectorAll(".fav").forEach(btn=>{
        btn.addEventListener("click", ()=>{
          const id = btn.dataset.id;
          if (favs.has(id)) {
            favs.delete(id);
            btn.classList.remove("active");
            btn.textContent = "☆ Add Favorite";
          } else {
            favs.add(id);
            btn.classList.add("active");
            btn.textContent = "★ Favorited";
          }
          saveFavs();
          renderFavorites();
        });
      });
    }

    function eventLite(e) {
      // Minimal data to render fav tile later without another API call (kept small)
      const name = e.name || "Untitled Festival";
      const url = e.url || "#";
      const img = (e.images||[]).sort((a,b)=>b.width-a.width)[0]?.url || "";
      const venue = e?._embedded?.venues?.[0];
      const place = [venue?.name, venue?.city?.name, venue?.country?.name].filter(Boolean).join(", ");
      const dates = e.dates?.start;
      const start = dates?.localDate || dates?.dateTime || "Date TBA";
      return { id:e.id, name, url, img, place, start };
    }

    function renderFavorites() {
      favList.innerHTML = "";
      const ids = [...favs];
      if (ids.length === 0) { favEmpty.style.display="block"; return; }
      favEmpty.style.display="none";

      // Build an index from lastData if available
      const index = new Map();
      const events = lastData?._embedded?.events || [];
      events.forEach(e => index.set(e.id, e));

      ids.forEach(async id => {
        let data;
        if (index.has(id)) {
          data = eventLite(index.get(id));
        } else {
          // Fallback fetch single event if not in current page
          try {
            const url = `https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${TM_API_KEY}`;
            const res = await fetch(url);
            const e = await res.json();
            data = eventLite(e);
          } catch {
            data = { id, name:"Saved Festival", url:"#", img:"", place:"", start:"" };
          }
        }

        const tile = document.createElement("div");
        tile.className = "card";
        tile.innerHTML = `
          ${data.img ? `<img class="cover" src="${data.img}" alt="">` : ""}
          <div class="pad">
            <div class="title">${data.name}</div>
            <div class="muted">${data.place || ""}</div>
            <div class="badges"><span class="badge">${data.start}</span></div>
            <div class="actions">
              <a class="pill" href="${data.url}" target="_blank" rel="noopener">Open</a>
              <button class="fav active" data-id="${data.id}">Remove</button>
            </div>
          </div>
        `;
        favList.appendChild(tile);
        tile.querySelector(".fav").addEventListener("click", ()=>{
          favs.delete(data.id); saveFavs(); renderFavorites();
          const btn = document.querySelector(`.fav[data-id="${data.id}"]`);
          if (btn){ btn.classList.remove("active"); btn.textContent = "☆ Add Favorite"; }
        });
      });
    }

    async function search(pageReset=false) {
      if (pageReset) page = 0;
      const params = buildParams();
      try {
        const data = await fetchEvents(params);
        renderList(data);
      } catch (e) {
        list.innerHTML = `<div class="empty">Error: ${e.message}</div>`;
      }
    }

    async function surpriseMe() {
      // Do a first fetch to know total pages, then jump to a random page
      const params = buildParams(true);
      try {
        const first = await fetchEvents(params);
        const totalPages = first?.page?.totalPages || 1;
        const randomPage = Math.floor(Math.random() * totalPages);
        page = randomPage;
        params.set("page", page);
        const data = randomPage === (first.page?.number || 0) ? first : await fetchEvents(params);
        renderList(data);

        // Open a random card’s link briefly (or highlight)
        const events = data?._embedded?.events || [];
        if (events.length) {
          const rnd = events[Math.floor(Math.random() * events.length)];
          // Scroll to the chosen one
          const btn = [...document.querySelectorAll(".card .pill")].find(a => a.href === (rnd.url || "#"));
          if (btn) btn.scrollIntoView({ behavior:"smooth", block:"center" });
        }
      } catch (e) {
        list.innerHTML = `<div class="empty">Error: ${e.message}</div>`;
      }
    }

    // Events
    btnSearch.addEventListener("click", ()=>search(true));
    [city,country,from,to,sort].forEach(i=>{
      i.addEventListener("keyup", e=>{ if (e.key==="Enter") search(true); });
      i.addEventListener("change", ()=>search(true));
    });
    btnPrev.addEventListener("click", ()=>{ if (page>0){ page--; search(false); window.scrollTo({top:0,behavior:"smooth"}); }});
    btnNext.addEventListener("click", ()=>{ page++; search(false); window.scrollTo({top:0,behavior:"smooth"}); });
    btnSurprise.addEventListener("click", surpriseMe);
    btnShowFavs.addEventListener("click", ()=>{ favoritesPanel.style.display="block"; renderFavorites(); });
    btnCloseFavs.addEventListener("click", ()=>{ favoritesPanel.style.display="none"; });

    // Boot
    (function init(){
      // sensible default: next 90 days
      const today = new Date();
      const in90 = new Date(Date.now()+1000*60*60*24*90);
      from.valueAsDate = today;
      to.valueAsDate = in90;
      initMap();
      search(true);
    })();
