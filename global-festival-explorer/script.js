 
 const searchBtn = document.getElementById('searchBtn');
    const cityInput = document.getElementById('city');
    const yearInput = document.getElementById('year');
    const statusDiv = document.getElementById('status');
    const listDiv = document.getElementById('list');

    const map = L.map('map').setView([34.5553, 69.2075], 6); // default Afghanistan-ish
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);
    let markers = L.layerGroup().addTo(map);

    async function searchFestivals() {
      const city = cityInput.value.trim();
      const year = yearInput.value.trim();
      if (!city || !year) return alert('Enter city and year');

      statusDiv.textContent = 'Searching...';
      listDiv.innerHTML = '';
      markers.clearLayers();

      try {
        const res = await fetch(`/api/search?city=${encodeURIComponent(city)}&year=${encodeURIComponent(year)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Request failed');

        statusDiv.textContent = `${data.count} festival(s) found (Wikidata).`;
        if (data.count === 0) {
          listDiv.innerHTML = '<div class="small">No festival data found for that city & year in Wikidata.</div>';
          return;
        }

        // populate list and map
        let firstCoord = null;
        data.results.forEach((f) => {
          const el = document.createElement('div');
          el.className = 'festival';
          el.innerHTML = `<strong>${f.name || '(no name)'}</strong>
            <div class="small">Location: ${f.location || '—' } | Start: ${f.start || '—'} | End: ${f.end || '—'}</div>
            ${f.wikipedia ? `<div class="small"><a href="${f.wikipedia}" target="_blank">Wikipedia</a></div>` : ''}`;
          listDiv.appendChild(el);

          if (f.coordinates) {
            const m = L.marker([f.coordinates.lat, f.coordinates.lon]).bindPopup(
              `<strong>${escapeHtml(f.name || '')}</strong><br>${escapeHtml(f.location || '')}`
            );
            markers.addLayer(m);
            if (!firstCoord) firstCoord = [f.coordinates.lat, f.coordinates.lon];
          }
        });

        if (firstCoord) map.setView(firstCoord, 11);
      } catch (err) {
        console.error(err);
        statusDiv.textContent = 'Error: ' + (err.message || err);
      }
    }

    searchBtn.addEventListener('click', searchFestivals);
    // helper
    function escapeHtml(s) { return s ? s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') : ''; }
