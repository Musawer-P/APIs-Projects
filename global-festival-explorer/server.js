import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const WIKIDATA_API = "https://www.wikidata.org/w/api.php";
const WIKIDATA_SPARQL = "https://query.wikidata.org/sparql";

async function findCityQid(cityName) {
  const params = new URLSearchParams({
    action: "wbsearchentities",
    format: "json",
    language: "en",
    search: cityName,
    type: "item",
    limit: "5",
  });
  const url = `${WIKIDATA_API}?${params.toString()}`;
  const res = await fetch(url);
  const j = await res.json();
  if (!j || !j.search || j.search.length === 0) return null;
  // best guess: first result
  return j.search[0].id; // e.g. "Qxxxx"
}

// 2. SPARQL query festivals located in that city (or located in admin. entity), with start/end/coord
function buildSparql(cityQid, year) {
  // We'll look for items that are instance of (P31) festival (Q132241) or subclass, and are located in city (P276 or P131)
  // Filter by YEAR(start) = year OR YEAR(end) = year. Use OPTIONAL for missing data.
  return `
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX p: <http://www.wikidata.org/prop/>
PREFIX ps: <http://www.wikidata.org/prop/statement/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT DISTINCT ?festival ?festivalLabel ?start ?end ?coord ?locLabel ?article WHERE {
  VALUES ?city { wd:${cityQid} }

  ?festival (wdt:P31/wdt:P279*) wd:Q132241 .       # instance of (or subclass) festival
  # location either point location or administrative entity
  OPTIONAL { ?festival wdt:P276 ?loc . }
  OPTIONAL { ?festival wdt:P131 ?loc . }
  OPTIONAL { ?festival wdt:P577 ?inception . } # inception fallback
  OPTIONAL { ?festival wdt:P580 ?start . }     # start time
  OPTIONAL { ?festival wdt:P582 ?end . }       # end time
  OPTIONAL { ?loc wdt:P625 ?coord . }
  OPTIONAL { ?festival wdt:P625 ?coord . }

  # connect location with the city (directly same or located in the city)
  # Condition: location is the city OR location located in admin entity chain includes city
  # We'll accept festivals whose loc equals city OR whose loc has P131* city
  ?loc (wdt:P131*)* ?city . 

  # Filter by year if possible
  FILTER(
    (!BOUND(?start) && !BOUND(?end)) || 
    (BOUND(?start) && (YEAR(?start) = ${year})) ||
    (BOUND(?end) && (YEAR(?end) = ${year}))
  )

  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". ?festival rdfs:label ?festivalLabel. ?loc rdfs:label ?locLabel. }
  OPTIONAL {
    ?article schema:about ?festival ;
             schema:inLanguage "en" ;
             schema:isPartOf <https://en.wikipedia.org/> .
  }
}
ORDER BY ?festivalLabel
LIMIT 200
`;
}

async function queryWikidataSparql(sparql) {
  const url = `${WIKIDATA_SPARQL}?query=${encodeURIComponent(sparql)}`;
  const res = await fetch(url, {
    headers: { Accept: "application/sparql-results+json" },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error("Wikidata SPARQL error: " + res.status + " - " + text.slice(0, 500));
  }
  const j = await res.json();
  return j;
}

app.get("/api/search", async (req, res) => {
  try {
    const city = (req.query.city || "").trim();
    const yearRaw = (req.query.year || "").trim();
    if (!city || !yearRaw) return res.status(400).json({ error: "Please provide city and year query params." });
    const year = parseInt(yearRaw, 10);
    if (Number.isNaN(year)) return res.status(400).json({ error: "Year must be a number." });

    const cityQid = await findCityQid(city);
    if (!cityQid) return res.status(404).json({ error: `City "${city}" not found on Wikidata.` });

    const sparql = buildSparql(cityQid, year);
    const results = await queryWikidataSparql(sparql);

    // transform results to friendly JSON
    const rows = (results.results.bindings || []).map((b) => {
      const coordRaw = b.coord?.value; // e.g. "Point(long lat)" or "Point(x y)" as WKT? Usually "Point(long lat)" is in literal format "Point(long lat)"
      let lat = null;
      let lon = null;
      if (coordRaw) {
        // Wikidata returns "Point(long lat)" inside a literal like "Point(13.40495 52.52001)" or as "Point(long lat)"
        const m = coordRaw.match(/Point\\(([-0-9\\.]+)\\s+([-0-9\\.]+)\\)/i) || coordRaw.match(/Point\\(([-0-9\\.]+)\\s+([-0-9\\.]+)\\)/i);
        if (m) { lon = parseFloat(m[1]); lat = parseFloat(m[2]); }
        // Some responses include geo:left/right or direct "lat lon" - try alternate split
        if (!lat && !lon) {
          const alt = coordRaw.replace(/[()]/g, "").split(" ");
          if (alt.length >= 2) {
            lon = parseFloat(alt[0]);
            lat = parseFloat(alt[1]);
          }
        }
      }
      return {
        id: b.festival?.value,
        name: b.festivalLabel?.value || null,
        start: b.start?.value || null,
        end: b.end?.value || null,
        location: b.locLabel?.value || null,
        wikipedia: b.article?.value || null,
        coordinates: (lat && lon) ? { lat, lon } : null,
      };
    });

    res.json({ city, cityQid, year, count: rows.length, results: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
