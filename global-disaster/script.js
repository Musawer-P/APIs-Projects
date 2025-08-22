const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

async function loadEarthquakes() {
  try {
    const res = await fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
    );
    const data = await res.json();

    data.features.forEach(eq => {
      const coords = eq.geometry.coordinates;
      const magnitude = eq.properties.mag;
      const place = eq.properties.place;
      const time = new Date(eq.properties.time).toLocaleString();

      L.circleMarker([coords[1], coords[0]], {
        radius: magnitude * 2,
        color: "red",
        fillOpacity: 0.6
      })
        .addTo(map)
        .bindPopup(`<b>Earthquake</b><br>Location: ${place}<br>Magnitude: ${magnitude}<br>Time: ${time}`);
    });
  } catch (err) {
    console.error("Error fetching earthquake data:", err);
  }
}

async function loadWildfires() {
  try {
    const res = await fetch(
      "https://eonet.gsfc.nasa.gov/api/v3/events?category=wildfires"
    );
    const data = await res.json();

    data.events.forEach(fire => {
      fire.geometry.forEach(g => {
        const coords = g.coordinates;
        const date = new Date(g.date).toLocaleString();

        L.marker([coords[1], coords[0]], { icon: fireIcon })
          .addTo(map)
          .bindPopup(`<b>Wildfire</b><br>${fire.title}<br>Date: ${date}`);
      });
    });
  } catch (err) {
    console.error("Error fetching wildfire data:", err);
  }
}

//Custom Icon for Wildfires
const fireIcon = L.icon({
  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Fire_icon.svg",
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

//Load all data
loadEarthquakes();
loadWildfires();



//Digital Time Capsule Feature


function saveCapsule(message, unlockDate) {
  const capsule = { message, unlockDate };
  localStorage.setItem("timeCapsule", JSON.stringify(capsule));
}

function openCapsule() {
  const capsule = JSON.parse(localStorage.getItem("timeCapsule"));
  if (!capsule) return alert("No capsule found!");

  const now = new Date();
  const unlock = new Date(capsule.unlockDate);

  if (now >= unlock) {
    alert("💌 Your message: " + capsule.message);
  } else {
    alert("⏳ Capsule is locked until " + unlock.toDateString());
  }
}

// Example usage
saveCapsule("Stay strong and keep coding 💻", "2025-12-31");
openCapsule();
