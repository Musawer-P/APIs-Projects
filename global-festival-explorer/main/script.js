const cityInput = document.getElementById('city');
const yearInput = document.getElementById('year');
const statusDiv = document.getElementById('status');
const listDiv = document.getElementById('list');
const searchBtn = document.getElementById('searchBtn');

// Leaflet map
const map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
const markers = L.layerGroup().addTo(map);

async function searchFestivals() {
  const city = cityInput.value.trim();
  const year = yearInput.value.trim();

  if (!city || !year) {
    alert("Enter city and year");
    return;
  }

  statusDiv.textContent = "Searching...";
  listDiv.innerHTML = "";
  markers.clearLayers();

  try {
    // 1️⃣ Get City QID
    const qidRes = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=en&search=${encodeURIComponent(city)}&type=item&limit=1&origin=*`
    );

    const qidData = await qidRes.json();
    if (!qidData.search || !qidData.search.length) throw new Error("City not found");
    const cityQid = qidData.search[0].id;

    // 2️⃣ SPARQL query
    const sparql = `
      PREFIX wd: <http://www.wikidata.org/entity/>
      PREFIX wdt: <http://www.wikidata.org/prop/direct/>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      SELECT DISTINCT ?festival ?festivalLabel ?start ?end ?coord ?locLabel ?article WHERE {
        VALUES ?city { wd:${cityQid} }

        ?festival wdt:P31/wdt:P279* wd:Q132241 .
        OPTIONAL { ?festival wdt:P276 ?loc . }
        OPTIONAL { ?festival wdt:P131 ?loc . }
        ?loc (wdt:P131*)? ?city .

        OPTIONAL { ?festival wdt:P580 ?start . }
        OPTIONAL { ?festival wdt:P582 ?end . }
        OPTIONAL { ?festival wdt:P625 ?coord . }
        OPTIONAL { ?loc wdt:P625 ?coord . }

        FILTER(
          (!BOUND(?start) && !BOUND(?end)) ||
          (BOUND(?start) && YEAR(?start) = ${year}) ||
          (BOUND(?end) && YEAR(?end) = ${year})
        )

        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }

        OPTIONAL {
          ?article schema:about ?festival ;
                   schema:inLanguage "en" ;
                   schema:isPartOf <https://en.wikipedia.org/> .
        }
      }
      LIMIT 50
    `;

    // 3️⃣ Proxy URL
    const sparqlUrl = "https://query.wikidata.org/sparql?query=" + encodeURIComponent(sparql) + "&format=json";
    const proxyUrl = "/.netlify/functions/proxy?url=" + encodeURIComponent(sparqlUrl);

    // 4️⃣ Fetch via proxy
    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error("SPARQL query failed: " + res.status);

    const data = await res.json();
    const results = data.results.bindings;
    if (!results.length) {
      statusDiv.textContent = "No festivals found.";
      return;
    }

    let firstCoord = null;

    results.forEach(f => {
      let lat = null, lon = null;
      if (f.coord?.value) {
        const match = f.coord.value.match(/Point\(([-0-9.]+) ([-0-9.]+)\)/);
        if (match) { lon = parseFloat(match[1]); lat = parseFloat(match[2]); }
      }

      const el = document.createElement('div');
      el.className = 'festival';
      el.innerHTML = `
        <strong>${f.festivalLabel?.value || "(No name)"}</strong>
        <div class="small">
          Location: ${f.locLabel?.value || "—"} |
          Start: ${f.start?.value || "—"} |
          End: ${f.end?.value || "—"}
        </div>
        ${f.article ? `<div class="small"><a href="${f.article.value}" target="_blank">Wikipedia</a></div>` : ""}
      `;
      listDiv.appendChild(el);

      if (lat && lon) {
        markers.addLayer(L.marker([lat, lon]).bindPopup(`<strong>${f.festivalLabel?.value}</strong><br>${f.locLabel?.value || ""}`));
        if (!firstCoord) firstCoord = [lat, lon];
      }
    });

    if (firstCoord) map.setView(firstCoord, 10);
    statusDiv.textContent = `${results.length} festival(s) found.`;

  } catch (err) {
    console.error(err);
    statusDiv.textContent = "Error: " + err.message;
  }
}

searchBtn.addEventListener('click', searchFestivals);
