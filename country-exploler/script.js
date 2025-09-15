 const input = document.getElementById("searchInput");
    const card = document.getElementById("countryCard");

    input.addEventListener("change", async () => {
      const country = input.value.trim();
      if (!country) return;

      const res = await fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`);
      if (!res.ok) {
        card.style.display = 'none';
        alert("Country not found!");
        return;
      }

      const data = await res.json();
      const c = data[0];

      document.getElementById("flag").src = c.flags.png;
      document.getElementById("name").textContent = c.name.common;
      document.getElementById("capital").textContent = c.capital?.[0] || "N/A";
      document.getElementById("population").textContent = c.population.toLocaleString();
      document.getElementById("region").textContent = c.region;
      document.getElementById("subregion").textContent = c.subregion;
      document.getElementById("area").textContent = c.area.toLocaleString();
      document.getElementById("timezones").textContent = c.timezones.join(", ");
      document.getElementById("languages").textContent = Object.values(c.languages || {}).join(", ");
      document.getElementById("currencies").textContent = Object.values(c.currencies || {}).map(cur => `${cur.name} (${cur.symbol})`).join(", ");
      document.getElementById("mapLink").href = c.maps.googleMaps;

      card.style.display = 'block';
    });

    // Neighboring country review 

    const neighborsDiv = document.getElementById("neighbors");
neighborsDiv.innerHTML = "";

if (c.borders) {
  c.borders.forEach(async code => {
    const res2 = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
    const data2 = await res2.json();
    const neighbor = document.createElement("button");
    neighbor.textContent = data2[0].name.common;
    neighbor.onclick = () => { input.value = neighbor.textContent; input.dispatchEvent(new Event("change")); };
    neighborsDiv.appendChild(neighbor);
  });
}


// Weater of capital city 

if (c.capital) {
  const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${c.capital[0]}&appid=YOUR_API_KEY&units=metric`);
  const weatherData = await weatherRes.json();
  document.getElementById("weather").textContent = 
    `🌡️ ${weatherData.main.temp}°C, ${weatherData.weather[0].description}`;
}
