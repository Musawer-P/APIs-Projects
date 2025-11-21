
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const busInfoDiv = document.querySelector(".bus-info");
const mapDiv = document.querySelector(".map");

let map, markersLayer;

function initMap() {
  if (map) {
    map.remove();
  }

  map = L.map(mapDiv, { attributionControl: true }).setView([51.505, -0.09], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);
}

function clearResults() {
  busInfoDiv.innerHTML = "";
  if (markersLayer) markersLayer.clearLayers();
}

function showMessage(html) {
  busInfoDiv.innerHTML = `<p>${html}</p>`;
}

function isRouteQuery(q) {
  return /\d/.test(q);
}

function fmtTime(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleTimeString();
  } catch {
    return ts;
  }
}
async function searchRoute(query) {
  clearResults();
  showMessage("Loading route data...");

  const lineId = encodeURIComponent(query);

  try {
    const url = `https://api.tfl.gov.uk/Line/${lineId}/Arrivals`;
    const res = await fetch(url);
    if (!res.ok) {
      showMessage(`No route found or API error for "${query}"`);
      return;
    }

    const arrivals = await res.json();
    if (!arrivals || arrivals.length === 0) {
      showMessage(`No active predictions found for route "${query}" right now.`);
      return;
    }

  
    arrivals.sort((a,b) => new Date(a.expectedArrival) - new Date(b.expectedArrival));

    // Show summary info
    let html = `<div class="bus-card"><p><strong>Live arrivals for route ${query.toUpperCase()}</strong></p></div>`;

    const shown = new Set();
    let count = 0;
    for (const a of arrivals) {
      const key = `${a.naptanId}-${a.destinationName}-${a.expectedArrival}`;
      if (shown.has(key)) continue;
      shown.add(key);
      count++;
      if (count > 12) break;

      const expected = fmtTime(a.expectedArrival);
      const stopName = a.stationName || a.stopPointName || a.platformName || a.naptanId || "Unknown stop";
      const direction = a.direction || a.towards || "";
      const vehicleId = a.vehicleId || a.vehicleId || "unknown";

      let lat = (a.latitude !== undefined) ? a.latitude : (a.location && a.location.latitude) ? a.location.latitude : null;
      let lon = (a.longitude !== undefined) ? a.longitude : (a.location && a.location.longitude) ? a.location.longitude : null;

      html += `
        <div class="bus-card">
          <p><strong>Stop:</strong> ${stopName}</p>
          <p><strong>Destination:</strong> ${a.destinationName}</p>
          <p><strong>Direction:</strong> ${direction}</p>
          <p><strong>Expected:</strong> ${expected}</p>
          <p><strong>VehicleId:</strong> ${vehicleId}</p>
          ${ (lat && lon) ? `<p><strong>Location:</strong> ${lat.toFixed(5)}, ${lon.toFixed(5)}</p>` : "" }
          <p><a target="_blank" href="https://www.google.com/maps?q=${lat || ""},${lon || ""}">Open in Google Maps</a></p>
        </div>
      `;

      if (lat && lon) {
        const marker = L.circleMarker([lat, lon], {
          radius: 7,
          color: "#007bff",
          fillColor: "#007bff",
          fillOpacity: 0.9
        }).bindPopup(`<strong>Vehicle ${vehicleId}</strong><br>${a.destinationName}<br>ETA: ${expected}`);
        markersLayer.addLayer(marker);
      } else {
        if (a.stationLatitude && a.stationLongitude) {
          const marker = L.marker([a.stationLatitude, a.stationLongitude]).bindPopup(`<strong>${stopName}</strong>`);
          markersLayer.addLayer(marker);
        }
      }
    }

    busInfoDiv.innerHTML = html;

    const allMarkers = markersLayer.getLayers();
    if (allMarkers.length > 0) {
      const group = L.featureGroup(allMarkers);
      map.fitBounds(group.getBounds().pad(0.25));
    }
  } catch (err) {
    console.error(err);
    showMessage("Failed to fetch route data (network/API).");
  }
}

async function searchStop(query) {
  clearResults();
  showMessage("Searching stops...");

  try {
    const url = `https://api.tfl.gov.uk/StopPoint/Search/${encodeURIComponent(query)}?modes=bus`;
    const res = await fetch(url);
    if (!res.ok) {
      showMessage("Failed to search stops.");
      return;
    }
    const data = await res.json();

    if (!data.matches || data.matches.length === 0) {
      showMessage(`No stops found matching "${query}".`);
      return;
    }

    let html = `<div class="bus-card"><p><strong>Stops matching "${query}"</strong></p></div>`;
    const matches = data.matches.slice(0, 12);

    matches.forEach(m => {
      const name = m.name || m.commonName || m.matchedName || "Unnamed stop";
      const id = m.id || m.commonId || m.id;
      const lat = m.lat || (m.lat && m.lon ? m.lat : null);
      const lon = m.lon || null;

      html += `
        <div class="bus-card">
          <p><strong>${name}</strong></p>
          <p>ID: ${id}</p>
          <p>
            <button class="btn-arrivals" data-stopid="${id}" data-stopname="${encodeURIComponent(name)}">Show live arrivals</button>
            <a class = "a-class" target="_blank" href="https://www.google.com/maps?q=${m.lat || ""},${m.lon || ""}">Map</a>
          </p>
        </div>
      `;
      if (m.lat && m.lon) {
        const marker = L.marker([m.lat, m.lon]).bindPopup(name);
        markersLayer.addLayer(marker);
      }
    });

    busInfoDiv.innerHTML = html;

    document.querySelectorAll(".btn-arrivals").forEach(btn => {
      btn.addEventListener("click", () => {
        const stopId = btn.dataset.stopid;
        const stopName = decodeURIComponent(btn.dataset.stopname);
        showStopArrivals(stopId, stopName);
      });
    });

    const allMarkers = markersLayer.getLayers();
    if (allMarkers.length > 0) {
      const group = L.featureGroup(allMarkers);
      map.fitBounds(group.getBounds().pad(0.25));
    } else {
      map.setView([51.505, -0.09], 12);
    }
  } catch (err) {
    console.error(err);
    showMessage("Failed to search stops (network/API).");
  }
}

async function showStopArrivals(stopId, stopName) {
  clearResults();
  showMessage(`Loading live arrivals for ${stopName}...`);

  try {
    const url = `https://api.tfl.gov.uk/StopPoint/${encodeURIComponent(stopId)}/Arrivals`;
    const res = await fetch(url);
    if (!res.ok) {
      showMessage("Failed to get arrivals for stop.");
      return;
    }
    const arrivals = await res.json();
    if (!arrivals || arrivals.length === 0) {
      showMessage(`No live arrivals at ${stopName} right now.`);
      return;
    }

    arrivals.sort((a,b) => new Date(a.expectedArrival) - new Date(b.expectedArrival));

    let html = `<div class="bus-card"><p><strong>Live arrivals at ${stopName}</strong></p></div>`;

    // add markers and list
    arrivals.slice(0, 20).forEach(a => {
      const expected = fmtTime(a.expectedArrival);
      const dest = a.destinationName || a.towards || "Unknown";
      const vehicleId = a.vehicleId || "unknown";
      const lat = a.latitude || (a.location && a.location.latitude) ? (a.latitude || a.location.latitude) : null;
      const lon = a.longitude || (a.location && a.location.longitude) ? (a.longitude || a.location.longitude) : null;

      html += `
        <div class="bus-card">
          <p><strong>Line:</strong> ${a.lineId} (${a.platformName || a.stopPointName || ""})</p>
          <p><strong>Destination:</strong> ${dest}</p>
          <p><strong>Expected:</strong> ${expected}</p>
          <p><strong>VehicleId:</strong> ${vehicleId}</p>
          ${ (lat && lon) ? `<p><strong>Location:</strong> ${lat.toFixed(5)}, ${lon.toFixed(5)}</p>` : "" }
          <p class = "open-map-class"><a class = "open-map" target="_blank" href="https://www.google.com/maps?q=${lat || ""},${lon || ""}">Open in Maps</a></p>
        </div>
      `;

      if (lat && lon) {
        const m = L.circleMarker([lat, lon], { radius:6, color:"#e63946", fillColor:"#e63946", fillOpacity:0.9 })
          .bindPopup(`<strong>${a.lineId}</strong><br>${dest}<br>ETA: ${expected}`);
        markersLayer.addLayer(m);
      } else if (a.platformName && a.naptanId) {
      }
    });

    busInfoDiv.innerHTML = html;

    const allMarkers = markersLayer.getLayers();
    if (allMarkers.length > 0) {
      const group = L.featureGroup(allMarkers);
      map.fitBounds(group.getBounds().pad(0.25));
    }
  } catch (err) {
    console.error(err);
    showMessage("Failed to fetch arrivals for stop (network/API).");
  }
}

async function handleSearch() {
  const q = searchInput.value.trim();
  if (!q) {
    alert("Please enter a route or stop to search.");
    return;
  }

  initMap();
  clearResults();

  if (isRouteQuery(q)) {
    await searchRoute(q);
  } else {
    await searchStop(q);
  }
}

searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("keydown", (e) => { if (e.key === "Enter") handleSearch(); });

// initialize map on load
initMap();
